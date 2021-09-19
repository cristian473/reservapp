import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Screen from '../../GlobalComponents/screen'
import {getMemberFormdata, saveThirdStep} from '../../../database/index'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'

const ThirdStep = () => {
    const {user, memberFormData} = useSelector((state) => state.user)    
    const [parents, setParents] = useState([])
    const [cardSelected, setCardSelected] = useState(null)
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if(!memberFormData){            
            getMemberFormdata(user.dni, user.institution_subscribed[0])
            .then((data) => {
                dispatch({type: 'SET_MEMBERFORM_DATA', payload: data})
                setParents(data.integrantsData || [])
            })
        } else {
            setParents(memberFormData.integrantsData || [])
        }
    }, [])

    const makeQuestions = async () => {
        const helper = [
            {title: 'Nombre completo:', inputType: 'text', key:'nombreCompleto'},
            {title: 'DNI:', inputType: 'number', key:'dni'},
            {title: 'Edad:', inputType: 'number', key: 'edad'},
        ]        
        let data = {}
        for (const row of helper) {
            let {value} = 
                await Swal.fire({
                    title: row.title,
                    input: row.inputType,
                    inputAttributes: {
                        autocapitalize: "true"
                    },
                    confirmButtonText: 'Continuar',
                })
            data[row.key] = value
        }
        let {value} = 
            await Swal.fire({
                title: 'Parentesco: ',
                input: 'select',
                inputOptions: {
                    'Madre': 'Madre',
                    'Padre': 'Padre',
                    'Hijo/a': 'Hijo/a',
                    'Hermano/a': 'Hermano/a',
                    'Abuelo/a': 'Abuelo/a',
                    'Tio/a': 'Tio/a',
                    'Sobrino/a': 'Sobrino/a',
                    'Suegro/a': 'Suegro/a',
                    'Yerno': 'Yerno',
                    'Nuera': 'Nuera',
                    'Cuñado/a': 'Cuñado/a',
                    'Bisabuelo/A': 'Bisabuelo/a',
                    'Biznieto/a': 'Biznieto/a',
                },
                inputAttributes:{
                    "size": "10"
                },
                inputPlaceholder: 'Selecciona una opción',
                confirmButtonText: 'Continuar',
            })
        data['parentesco'] = value
        

        return data;
    }
    
    const handleAddParents = () => {
        makeQuestions().then((res) => {
            setParents([...parents, res])
        })
    }

    const handleContinue = () => {
        if(parents.length === 0) return history.push('/form?step=4');
        const integrantsData = parents
        const integrantsDni = parents.map((el) => el.dni.split('.').join(""))
        saveThirdStep(user.dni, user.institution_subscribed[0], {integrantsData, integrantsDni})
        .then(() => {
            dispatch({type: 'SET_MEMBERFORM_DATA', payload: {...memberFormData, integrantsData, integrantsDni}})
            Swal.fire('Guardado correctamente')
            history.push('/form?step=4')
        })
    }

    const removeParent = (i) => {
        const temp = parents.filter((el, index) => index !== i)
        setParents(temp)
        setCardSelected(null)
    }

    const handleSelect = (i) => {
        if(cardSelected === i){
            setCardSelected(null)
        } else {
            setCardSelected(i)
        }
    }

    return (
        <Screen extendBody title={`Integrantes ${parents.length ? `(${parents.length})` : ''}`} >
            <div className="thirdStepContainer">
                {parents.length === 0 && (
                    <p>
                        En este paso añadirá las personas con las que convive en su misma casa o domicilio. 
                        (si no necesita agregar personas, puede simplemente continuar)
                    </p>
                )}
                {parents.length > 0 && (
                    <div className="parentsCardsContainer">
                        {parents.map(({nombreCompleto, dni, parentesco, edad}, index) => (
                            <div key={index} className="parentCard" onClick={() => handleSelect(index)} >
                                <div className="row">
                                    <div className="col">
                                        <small>Nombre: </small>
                                        <span>{nombreCompleto.slice(0, 8) + '...'}</span>
                                    </div>
                                    <div className="col">
                                        <small>Parentesco: </small>
                                        <span>{parentesco}</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <small>DNI: </small>
                                        <span>{dni}</span>
                                    </div>
                                    <div className="col">
                                        <small>Edad: </small>
                                        <span>{edad}</span>
                                    </div>
                                </div>
                                {cardSelected === index && (
                                    <div className="row">
                                        <button className='customButton' onClick={() => removeParent(index)}>Remover</button>
                                    </div>
                                )}
                            </div>   
                        ))}
                    </div>
                )}
                <div className="buttonsContainer">
                    <button className='customButton' onClick={handleAddParents}>Añadir</button>
                    <button className='customButton' onClick={handleContinue}>Continuar</button>
                </div>
            </div>
        </Screen>
    )
}

export default ThirdStep