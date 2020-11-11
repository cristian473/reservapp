import React from 'react'
import Screen from '../GlobalComponents/screen'

import '../../styles/eventComponent.scss'
const Event = (props) => {
    const { match: { params: { code } } } = props;
    const event = {
        eventName: 'Reunión general',
        institutionName: 'Comunidad CDT',
        address: 'Libertad 3248, El Talar, Tigre',
        date: '20/11/2020',
        time: '18:00',
        details: 'Por favor ingresar con barbijo',
        cuposTotales: 30,
        cuposDisponibles: 10,
        code: 3557
    }
    return (
        <Screen title={'Sobre el evento'} history={props.history}>
            <div className='eventContainer'>
                <div className="code">
                    <span>COD: {code}</span>
                </div>
                <div className="dataContainer">
                    <h5>{event.eventName} en {event.institutionName}</h5>
                    <h5>Dirección: {event.address}</h5>
                    <h5>Sabado {event.date} a las {event.time}hs </h5>
                    <h5>Quedan {event.cuposDisponibles} cupos disponibles </h5>
                </div>
                <button>Reservar mi lugar</button>
            </div>
        </Screen>
    )
}

export default Event