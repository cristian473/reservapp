import React, { useEffect } from 'react'
import Screen from './screen'
import { useDispatch, useSelector } from 'react-redux'
import { getEventByCode } from '../../database'
import '../../styles/eventComponent.scss'
const Event = (props) => {
    const dispatch = useDispatch()
    const { match: { params: { code } } } = props;
    const { eventInfo, user } = useSelector(state => state.user)
    useEffect(() => {
        if (code) {
            dispatch(getEventByCode(code))
        }
    }, [code])

    const handlerReserve = () => {
        props.history.push(`/event/${code}/reserve`)
    }

    return (
        <Screen title={'Sobre el evento'} history={props.history}>
            <div className='eventContainer'>
                <div className="code">
                    <span>COD: {code}</span>
                </div>
                <div className="dataContainer">
                    <h5>{eventInfo.eventName} en {eventInfo.institutionName}</h5>
                    <h5>Dirección: {eventInfo.address}</h5>
                    <h5>Sabado {eventInfo.date} a las {eventInfo.time}hs </h5>
                    <h5>Quedan {`${eventInfo.cupos_disponibles}/${eventInfo.cupos}`} cupos disponibles </h5>
                </div>
                {user.type !== 'institution' && (
                    <button className='customButton' onClick={() => handlerReserve()} >Reservar mi lugar</button>
                )}
            </div>
        </Screen>
    )
}

export default Event