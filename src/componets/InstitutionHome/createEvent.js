import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Screen from '../GlobalComponents/screen'
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import { Switch, FormControlLabel } from '@material-ui/core'
import Input from '../GlobalComponents/input'
import DateFnsUtils from '@date-io/date-fns';
import { setEvent } from '../../database'
import moment from 'moment'
import '../../styles/createEvent.scss'
import Swal from 'sweetalert2';
const initialState = {
    eventName: '',
    address: '',
    cupos: '',
    time: null,
    date: null,
    formCovid: true
}

const CreateEvent = (props) => {
    const [dataEvent, setDataEvent] = useState(initialState)
    const { user } = useSelector((store) => store.user)
    const handleInputChange = (e) => {
        const { value, name } = e.target
        setDataEvent({ ...dataEvent, [name]: value })
    }
    const handlerPicker = (value, field) => {
        setDataEvent({ ...dataEvent, [field]: value })
    }

    const renderInput = (type, props) => {
        switch (type) {
            case 'time':
                return (
                    <Input
                        value={props.value}
                        onClick={() => props.onClick()}
                        name={props.name}
                        placeholder='Hora'
                    />
                )
            case 'date':
                return (
                    <Input
                        value={props.value}
                        onClick={() => props.onClick()}
                        name={props.name}
                        placeholder='Fecha'
                    />
                )
            default:
                break;
        }
    }

    const handlerSubmit = async () => {
        let res = setEvent(dataEvent, user)
        if (res) {
            await Swal.fire('Exito!', 'Evento creado', 'success')
            props.history.push('/')
        }
    }
    return (
        <Screen title={'Completá los datos:'} history={props.history}>
            <div className="createEventComponent">
                <input
                    className='customInput'
                    type="text"
                    name='eventName'
                    placeholder='Nombre del evento'
                    value={dataEvent.eventName}
                    onChange={handleInputChange}
                />
                <input
                    className='customInput'
                    type="text"
                    name='address'
                    placeholder='Dirección del evento'
                    value={dataEvent.address}
                    onChange={handleInputChange}
                />
                <div className="cuposTime">
                    <input
                        type="number"
                        name='cupos'
                        className=' customInput'
                        placeholder='Cupos'
                        value={dataEvent.cupos}
                        onChange={handleInputChange}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <TimePicker
                            clearable
                            TextFieldComponent={(props) => renderInput('time', props)}
                            name='time'
                            value={dataEvent.time}
                            onChange={(value) => handlerPicker(value, 'time')}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        clearable
                        name='time'
                        className='ml-1 mr-4'
                        value={dataEvent.date}
                        TextFieldComponent={(props) => renderInput('date', props)}
                        onChange={(value) => handlerPicker(value, 'date')}
                    />
                </MuiPickersUtilsProvider>
                <FormControlLabel
                    control={
                        <Switch
                            checked={dataEvent.formCovid}
                            onChange={() => setDataEvent({ ...dataEvent, formCovid: !dataEvent.formCovid })}
                            size='small'
                            color='primary'
                        />
                    }
                    value={dataEvent.formCovid}
                    label="Formulario de covid antes de la reserva"
                    labelPlacement="top"
                />
                <button onClick={handlerSubmit} className='customButton'>
                    Crear
                </button>
            </div>
        </Screen>
    )
}

export default CreateEvent