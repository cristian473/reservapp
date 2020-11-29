import React, { useEffect, useState } from 'react'
import Screen from '../GlobalComponents/screen'
import { useSelector } from 'react-redux'
import { getReservInfo, cancelReserv } from '../../database'
import Swal from 'sweetalert2'
import { CircularProgress } from '@material-ui/core'
import moment from 'moment'
const ReservInfo = (props) => {
    const { user } = useSelector((store) => store.user)
    const { match: { params: { id } } } = props
    const [res, setRes] = useState(null)
    useEffect(() => {
        (async () => {
            let resv = await getReservInfo(id, user.dni)
            setRes(resv)
        })()
    }, [user])


    const handlerCancelresev = async () => {
        Swal.showLoading()
        let resQuery = await cancelReserv(res)
        if (resQuery) {
            await Swal.fire('Éxito', 'Reserva cancelada', 'success')
            props.history.goBack()
        } else {
            Swal.fire('Error!', 'ocurrió un error, por favor intente nuevamente', 'error')
        }
    }

    const formatDate = (date) => {
        return `${date.split('-')[2]}${date.split('-')[1]}${date.split('-')[0]}`
    }

    return (
        <Screen history={props.history} title={`${res ? res.eventInfo.eventName : ''}`}>
            <div style={{ height: '100%' }} className="d-flex align-items-center justify-content-around flex-column">
                {res ? (
                    <>
                        <h5>Direccion: {res.eventInfo.address}</h5>
                        <h5>Fecha: {res.eventInfo.date} </h5>
                        <h5>Hora: {res.eventInfo.time} </h5>
                        <h5>Cupos reservados: {res.cupos_reservados} </h5>
                        {formatDate(res.eventInfo.date) >= moment().format('YYYYMMDD') &&
                            <button className='customButton cancel' onClick={handlerCancelresev} >Cancelar reserva</button>
                        }
                    </>
                ) : (
                        <CircularProgress />
                    )}

            </div>
        </Screen>
    )
}

export default ReservInfo