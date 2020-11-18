import React, { useEffect } from 'react'
import Screen from './screen'
import { useDispatch, useSelector } from 'react-redux'
import { getEventByCode } from '../../database'
import '../../styles/eventComponent.scss'
import { CircularProgress } from '@material-ui/core';
import moment from 'moment'
import 'moment/locale/es';
const Event = (props) => {
    const dispatch = useDispatch()
    const { match: { params: { code } } } = props;
    const { eventInfo, user } = useSelector(state => state.user)
    useEffect(() => {
        if (code) {
            dispatch(getEventByCode(code))
        }
    }, [code])
    const redirectTo = (path) => {
        props.history.push(path)
    }

    const dateToDay = (date) => {
        let d = date.split('-')
        d = jsUcfirst(moment(`${d[2]}/${d[1]}/${d[0]}`).locale('es').format('dddd'))
        return d
    }

    function jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Screen title={'Sobre el evento'} history={props.history}>
            <div className='eventContainer'>
                <div className="code">
                    <span>COD: {code}</span>
                </div>
                {eventInfo?.eventName ? (
                    <>
                        <div className="dataContainer">
                            <h5>{eventInfo.eventName} en {eventInfo.institutionName}</h5>
                            <h5>Dirección: {eventInfo.address}</h5>
                            <h5>{dateToDay(eventInfo.date)} {eventInfo.date} a las {eventInfo.time}hs </h5>
                            <h5>Quedan {`${eventInfo.cupos_disponibles}/${eventInfo.cupos}`} cupos disponibles </h5>
                        </div>
                        {user.type !== 'institution' ? (
                            <button className={`customButton ${eventInfo.cupos_disponibles === 0 && 'disabled'}`} onClick={() => redirectTo(`/event/${code}/reserve`)} >{eventInfo.cupos_disponibles > 0 ? 'Reservar mi lugar' : 'Cupos agotados'}</button>
                        ) : (
                                <button className='customButton' onClick={() => redirectTo(`/event/${code}/reservas`)} > Ver reservas </button>
                            )}

                    </>
                ) : (
                        <CircularProgress />
                    )}
            </div>
        </Screen>
    )
}

export default Event