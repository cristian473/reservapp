import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CovidForm from './covidForm'
import Screen from '../GlobalComponents/screen'
import { useEffect } from 'react'
import Swal from 'sweetalert2'

const ReserveForm = ({ type, setInputStyles, sendReserve }) => {
    const dispatch = useDispatch();
    const [meForm, setMeform] = useState({ acceptFormCovid: '' });
    const [otherForm, setotherForm] = useState({ personName: '', acceptFormCovid: '', contactWithPerson: '' });
    const [familyForm, setfamilyForm] = useState({ familyName: '', acceptFormCovid: '', integrants_number: '' });
    const [inputs, setInputs] = useState([]);
    const { user, integrants, eventInfo } = useSelector((store) => store.user);
    const [modalOpen, setModalOpen] = useState(false);

    const handlerOther = (e) => {
        const { value, name } = e.target;
        setotherForm({ ...otherForm, [name]: value });
    }
    const handlerFamily = (e) => {
        const { value, name } = e.target;
        setfamilyForm({ ...familyForm, [name]: value });
    }
    const setConfirmFormCovid = (res) => {
        if (type === 'other') {
            setotherForm({ ...otherForm, acceptFormCovid: res, cupos_reservados: 1 });
        }
        if (type === 'family') {
            setfamilyForm({ ...familyForm, acceptFormCovid: res, integrants: integrants, cupos_reservados: familyForm.integrants_number });
        }
        if (type === 'me') {
            setMeform({ ...meForm, acceptFormCovid: res, cupos_reservados: 1 });
        }
    }

    const handlerInputsFamily = (e, i) => {
        const { value } = e.target;
        let temp = [...integrants];
        temp[i] = value;
        dispatch({ type: 'SET_INTEGRANTS', payload: temp });
    }

    const inputsFamily = () => {
        if (familyForm.integrants_number > 0) {
            let inputs = [];
            let integrantsSchema = [];
            for (let i = 0; i < familyForm.integrants_number; i++) {
                inputs.push(
                    <input
                        className='customInput'
                        type="text"
                        name='integrants'
                        placeholder='Nombre del integrante'
                        value={integrants[i]}
                        onChange={(e) => handlerInputsFamily(e, i)}
                    />
                )
                integrantsSchema[i] = ''
            }
            dispatch({ type: 'SET_INTEGRANTS', payload: integrantsSchema })
            setInputs(inputs)
            setInputStyles(true)
        }
    }

    useEffect(() => {
        if (integrants.length > 0) {
            let inputs = []
            for (let i = 0; i < familyForm.integrants_number; i++) {
                inputs.push(
                    <input
                        className='customInput'
                        type="text"
                        name='integrants'
                        placeholder='Nombre del integrante'
                        value={integrants[i]}
                        onChange={(e) => handlerInputsFamily(e, i)}
                    />
                )
            }
            setInputs(inputs)
        }
    }, [integrants])

    useEffect(() => {
        if (!familyForm.integrants_number) {
            setInputs([])
            setInputStyles(false)
        }
    }, [familyForm])

    const handlerConfirm = () => {
        let data = {}
        if (type === 'me') {
            data = { ...meForm, eventInfo: eventInfo, registeredFor: user }
            sendReserve(type, data)
        }
        if (type === 'family') {
            if(!familyForm.integrants_number) return Swal.fire('','Debe indicar la cantidad de integrantes', 'error')
            data = { ...familyForm, eventInfo: eventInfo, registeredFor: user }
            sendReserve(type, data)
        }
        if (type === 'other') {
            data = { ...otherForm, eventInfo: eventInfo, registeredFor: user }
            if(data.personName === '' || data.personName.split(' ').length <= 1) return Swal.fire('','Debe agregar nombre y apellido del invitado', 'error')
            sendReserve(type, data)
        }

    }
    return (
        <div className="formContainer">
            {type === 'me' && (
                <>
                    <h5>{eventInfo.institutionName} necesita que usted lea el siguiente formulario.</h5>
                    {meForm.acceptFormCovid && (<h6>{`Respuesta al formulario: ${meForm.acceptFormCovid.toUpperCase()} tuve sintomas o caso estrecho en los ultimos 14 días`}</h6>)}
                    <div className="buttons">
                        <button className='customButton' onClick={() => setModalOpen(true)} >Ver formulario</button>
                        <button className={`customButton ${!meForm.acceptFormCovid && 'disabled'}`} onClick={handlerConfirm}>Confirmar reserva</button>
                    </div>
                    <CovidForm modalOpen={modalOpen} setModalOpen={setModalOpen} setConfirmFormCovid={setConfirmFormCovid} type='me' />
                </>
            )}

            {type === 'other' && (
                <>  <div className="inputs">
                    <input
                        className='customInput'
                        type="text"
                        name='personName'
                        placeholder='Nombre del invitado'
                        value={otherForm.personName}
                        onChange={handlerOther}
                    />
                    <input
                        className='customInput'
                        type="text"
                        name='contactWithPerson'
                        placeholder='Algun dato de contacto'
                        value={otherForm.contactWithPerson}
                        onChange={handlerOther}
                    />
                </div>
                    <h5>{eventInfo.institutionName} necesita que el invitado lea el siguiente formulario.</h5>
                    {otherForm.acceptFormCovid && (<h6>{`Respuesta al formulario: ${otherForm.acceptFormCovid.toUpperCase()} tuvo sintomas o caso estrecho en los ultimos 14 días`}</h6>)}
                    <div className="buttons">
                        <button className='customButton' onClick={() => setModalOpen(true)} >Ver formulario</button>
                        <button className={`customButton ${!otherForm.acceptFormCovid && 'disabled'}`} onClick={handlerConfirm}>Confirmar reserva</button>
                    </div>
                    <CovidForm modalOpen={modalOpen} setModalOpen={setModalOpen} setConfirmFormCovid={setConfirmFormCovid} type='other' />
                </>
            )}

            {type === 'family' && (
                <>  <div className="familyinputs">
                    <input
                        className='customInput'
                        type="text"
                        name='familyName'
                        placeholder='Apellido de la familia'
                        value={familyForm.familyName}
                        onChange={handlerFamily}
                    />
                    <input
                        className='customInput'
                        type="number"
                        name='integrants_number'
                        placeholder='Número de integrantes'
                        value={familyForm.integrants_number}
                        onChange={handlerFamily}
                    />
                    {familyForm.integrants_number > 0 && inputs.length === 0 && inputsFamily()}
                    {inputs.length > 0 && familyForm.integrants_number > 0 &&
                        inputs.map((int) => int)
                    }
                </div>
                    <h5>{eventInfo.institutionName} necesita que ustedes lean el siguiente formulario.</h5>
                    {familyForm.acceptFormCovid && (<h6>{`Respuesta al formulario: ${familyForm.acceptFormCovid.toUpperCase()} tuvimos sintomas o caso estrecho en los ultimos 14 días`}</h6>)}
                    <div className="buttons">
                        <button className='customButton' onClick={() => setModalOpen(true)} >Ver formulario</button>
                        <button className={`customButton ${!familyForm.acceptFormCovid && 'disabled'}`} onClick={handlerConfirm}>Confirmar reserva</button>
                    </div>
                    <CovidForm modalOpen={modalOpen} setModalOpen={setModalOpen} setConfirmFormCovid={setConfirmFormCovid} type='family' />
                </>
            )}
        </div>


    )
}
export default ReserveForm