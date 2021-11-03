import Screen from "../../GlobalComponents/screen"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import '../../../styles/memberFormStyles.scss'
import { getMemberFormdata, saveFourthStep } from "../../../database"
import { useHistory } from "react-router"

const formInitialState = {
    convertionDate: '',
    convertionPlace: '',
    convertionMinister: '',
    baptismDate: '',
    baptismPlace: '',
    baptismMinister: '',
    isBaptism: 'false'
}

const optionsParameter = {
    width: 270,
    height: 40,
    paddingY: 25,
    paddingX: 10,
    canvasTargetDom: ".js-canvasTargetDom",
    font:  ["30px", "'Alex Brush'"],
    color: "black",    
    customFont: { 
        name: 'Alex Brush',
        url: "https://fonts.googleapis.com/css2?family=Alex+Brush&family=Grey+Qo&display=swap"  
    }
};

const FourthStep = () => {
    const {user, memberFormData} = useSelector((state) => state.user)
    const [formData, setFormData] = useState(formInitialState)
    const [signature, setSignature] = useState({text: ''})
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if(!memberFormData){            
            getMemberFormdata(user.dni, user.institution_subscribed[0])
            .then((data) => {
                dispatch({type: 'SET_MEMBERFORM_DATA', payload: data})
                let formState = {...formInitialState, ...data.convertionData, ...data.baptismData, ...data.signature}
                setFormData(formState)
            })
        } else {
            let formState = {...formInitialState, ...memberFormData.convertionData, ...memberFormData.baptismData, ...memberFormData.signature}
            setFormData(formState)
        }
    }, [])

    const handleInputChange = ({target: {name, value}}) => {
        setFormData({...formData, [name]: value})
    }

    const modifySignature = async () => {
        return await Swal.fire({
            title: 'Ingrese su nombre',
            input: 'text',
            inputAttributes: {
                autocapitalize: "true"
            },
            confirmButtonText: 'Confirmar',
        })
    }

    const capitalize = (str='', lower = false) =>(
        (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
    );

    const sing = (textString) => {
        setSignature({text: textString})
    }

    const handleSign = () => {
        if(!signature.text){
            sing(capitalize(user.name))
            loadingSing('Firmando...')
        } else {
            modifySignature().then(({value}) => {
                sing(capitalize(value))
                loadingSing('Modificando firma...')    
            })
        }        
    }

    const loadingSing = (message) => {
        Swal.fire(message)
        Swal.showLoading()
        setTimeout(() => {
            Swal.hideLoading()
            Swal.close()
        }, 1000)
    }

    const handleSumbit = (e) => {
        e.preventDefault()
        const {
            convertionDate,
            convertionPlace,
            convertionMinister,
            baptismDate,
            baptismPlace,
            baptismMinister,
            isBaptism
        } = formData;

        const convertionData = {convertionDate,convertionPlace, convertionMinister}
        const baptismData = {baptismDate,baptismPlace,baptismMinister,isBaptism}

        saveFourthStep(user.dni, user.institution_subscribed[0], {convertionData, baptismData, signature})
        .then(() => {
            dispatch({type: 'SET_FORM_COMPLETED'})
            return Swal.fire('Formulario completo!', '', 'success')
        })
        .then(() => history.push(`/`))
    }

    return (
        <Screen extendBody title={'Último paso'}> 
            <form onSubmit={handleSumbit} className={'secondStepContainer'}>
                <h5>CONVERSIÓN</h5>
                <label>Fecha: </label>
                <input type='date' required autoComplete='off' name='convertionDate' value={formData.convertionDate} onChange={handleInputChange}/>
                <label>Lugar o nombre de la iglesia: </label>
                <input required autoComplete='off' name='convertionPlace' value={formData.convertionPlace} onChange={handleInputChange}/>
                <label>Pastor: </label>
                <input required autoComplete='off' name='convertionMinister' value={capitalize(formData.convertionMinister)} onChange={handleInputChange}/>
                <label>Está bautizado?</label>
                    <div className="row underlined">
                        <label htmlFor='No'>Si</label>
                        <input id='No' type='radio' name='isBaptism' value='true' checked={formData.isBaptism === 'true'} onChange={handleInputChange}/>
                    </div>
                    <div className="row underlined">
                        <label htmlFor='No'>No</label>
                        <input id='No' type='radio' name='isBaptism' value='false' checked={formData.isBaptism === 'false'} onChange={handleInputChange}/>
                    </div>                   
                {formData.isBaptism === 'true' && (
                    <>
                        <h5>BAUTISMO</h5>
                        <label>Fecha: </label>
                        <input type='date' autoComplete='off' name='baptismDate' value={formData.baptismDate} onChange={handleInputChange}/>
                        <label>Lugar o nombre de la iglesia: </label>
                        <input autoComplete='off' name='baptismPlace' value={formData.baptismPlace} onChange={handleInputChange}/>
                        <label>Pastor: </label>
                        <input autoComplete='off' name='baptismMinister' value={capitalize(formData.baptismMinister)} onChange={handleInputChange}/>
                    </>    
                )}
                {signature.text && (
                    <div className="signatureContainer">
                        <p>Firma: </p>
                        <div className="signature">
                            <p>{signature.text}</p>
                        </div>
                    </div>
                )}
                <div className="buttonsContainer">
                    <button type='button' onClick={handleSign} className='customButton'>{!signature.text ? 'Firmar' : 'Modificar firma'}</button>
                    <button type='submit' className={`customButton ${!signature.text && 'disabled'}`}>Finalizar</button>                
                </div>                
            </form>
        </Screen>
    )
}
export default FourthStep;