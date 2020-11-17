import React, { useEffect, useState } from 'react'
import Screen from '../GlobalComponents/screen'
import { useSelector } from 'react-redux'
import { getReservInfo } from '../../database'
import Swal from 'sweetalert2'
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
    return (
        <Screen history={props.history} title={`${res ? res.eventInfo.eventName : ''}`}>
            {res && (
                <div style={{ height: '100%' }} className="d-flex align-items-center justify-content-around flex-column">
                    <h5>Direccion: {res.eventInfo.address}</h5>
                    <h5>Fecha: {res.eventInfo.date} </h5>
                    <h5>Hora: {res.eventInfo.time} </h5>
                    <h5>Cupos reservados: {res.cupos_reservados} </h5>
                </div>
            )}
        </Screen>
    )
}

export default ReservInfo