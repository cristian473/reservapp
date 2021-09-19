import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getMemberFormdata, saveSecondStepMemberForm } from "../../../database";
import Screen from "../../GlobalComponents/screen";
import {useHistory} from 'react-router-dom'

const personalFormInitialState = {
    name: '',
    dni: '',
    nacionalidad: '',
    fechaNac: '',
    lugarNac: '',
    calle: '',
    calleNro: '',
    localidad: '',
    partido: '',
    cp: '',
    provincia: '',
    tel: '',
    email: '',
    estadoCivil: '',
    separadoMotivo: '',
    añoCasamiento: '',
    profesion: '',
    estudiosCursados: '',
    otrosEstudiosCursados: '',
}

const SecondStep = () => {    
    const {user} = useSelector((state) => state.user)
    const [personalDataForm, setPersonalDataForm] = useState({...personalFormInitialState, name: user.name, dni: user.dni, email: user.email, tel: user.tel})
    const history = useHistory()
    const dispatch = useDispatch()

    const handleInputChange = ({target:{name, value}}) => {
        setPersonalDataForm({...personalDataForm, [name]: value})
    }

    const capitalize = (str='', lower = false) =>(
        (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
    );
    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire('Guardando...')
        Swal.showLoading()
        saveSecondStepMemberForm(user.dni, user.institution_subscribed[0], personalDataForm)
        .then(() => {
            Swal.hideLoading()
            Swal.fire('Guardado correctamente')
            history.push('/form?step=3')
        })
    }

    useEffect(() => {
        getMemberFormdata(user.dni, user.institution_subscribed[0])
        .then((res) => {
            dispatch({type: 'SET_MEMBERFORM_DATA', payload: res})
            if(res.personalData){
                setPersonalDataForm(res.personalData)
            }
        })
    }, [])

    const StudiesHelper = ['Ninguno','Primario','Secundario incompleto','Secundario','Universitario']

    return (
        <Screen extendBody title='Información personal'>
            <form onSubmit={handleSubmit} className='secondStepContainer'>
                <label>Apellido y nombres</label>
                <input required autoComplete='off' name='name' value={capitalize(personalDataForm.name)} onChange={handleInputChange} />
                <label>DNI Nro:</label>
                <input required autoComplete='off' name='dni' value={personalDataForm.dni} onChange={handleInputChange}/>
                <label>Nacionalidad:</label>
                <input required autoComplete='off' name='nacionalidad' value={capitalize(personalDataForm.nacionalidad)} onChange={handleInputChange}/>
                <label>Fecha de nacimiento:</label>
                <input required autoComplete='off' name='fechaNac' type='date' value={personalDataForm.fechaNac} onChange={handleInputChange}/>
                <label>Lugar de nacimiento:</label>
                <input required autoComplete='off' name='lugarNac' value={personalDataForm.lugarNac} onChange={handleInputChange}/>
                <h5>Domicilio: </h5>
                <label>Calle:</label>
                <input required autoComplete='off' name='calle' value={personalDataForm.calle} onChange={handleInputChange}/>
                <label>Nro:</label>
                <input required autoComplete='off' name='calleNro' value={personalDataForm.calleNro} onChange={handleInputChange}/>
                <label>Localidad:</label>
                <input required autoComplete='off' name='localidad' value={personalDataForm.localidad} onChange={handleInputChange}/>
                <label>Partido:</label>
                <input required autoComplete='off' name='partido' value={personalDataForm.partido} onChange={handleInputChange}/>
                <label>Código postal:</label>
                <input required autoComplete='off' name='cp' value={personalDataForm.cp} onChange={handleInputChange}/>
                <label>Provincia:</label>
                <input required autoComplete='asd' name='provincia' value={capitalize(personalDataForm.provincia)} onChange={handleInputChange}/>
                <label>Teléfono:</label>
                <input autoComplete='off' name='tel' value={personalDataForm.tel} onChange={handleInputChange}/>
                <label>Email:</label>
                <input autoComplete='off' name='email' value={personalDataForm.email} onChange={handleInputChange}/>
                <label>Estado civil:</label>
                <select required name='estadoCivil' value={personalDataForm.estadoCivil} onChange={handleInputChange}>
                    <option value=''>--Seleccione una opción--</option>
                    <option value='Soltero/a'>Soltero/a</option>
                    <option value='Casado/a'>Casado/a</option>
                    <option value='Vuido/a'>Vuido/a</option>
                    <option value='Divociado/a'>Divociado/a</option>
                </select>
                {personalDataForm.estadoCivil.includes('Divociado/a', 'Soltero/a') && (
                    <>
                        <label>Si se encuentra separado o divorciado explique brevemente el motivo de la disolución conyugal:</label>
                        <input autoComplete='off' name='separadoMotivo' value={personalDataForm.separadoMotivo} onChange={handleInputChange}/>
                    </>
                )}
                {personalDataForm.estadoCivil.includes('Casado/a') && (
                    <>
                        <label>Año de casamiento:</label>
                        <input required type='number' autoComplete='off' name='añoCasamiento' value={personalDataForm.añoCasamiento} onChange={handleInputChange}/>
                    </>
                )}
                <label>Profesión:</label>
                <input required autoComplete='off' name='profesion' value={personalDataForm.profesion} onChange={handleInputChange}/>
                <label>Estudios cursados:</label>
                {StudiesHelper.map((studie) => (
                    <div className="row underlined">
                        <label htmlFor={studie}>{studie}</label>
                        <input id={studie} type='radio' name='estudiosCursados' value={studie} checked={personalDataForm.estudiosCursados === studie} onChange={handleInputChange}/>
                    </div>
                ))}                   
                <label>Otros estudios cursados:</label>
                <input autoComplete='off' name='otrosEstudiosCursados' value={personalDataForm.otrosEstudiosCursados} onChange={handleInputChange}/>
                <div className="buttonsContainer">
                    <button type='submit' className='customButton'>Guardar y continuar</button>
                </div>
            </form>
        </Screen>
    )
}

export default SecondStep;