import React, { useEffect } from 'react'
import Screen from '../GlobalComponents/screen'
import EventCard from '../GlobalComponents/eventCard'
import '../../styles/myeventsStyles.scss'
import { getReservesToUser } from '../../database'
import { useSelector, useDispatch } from 'react-redux'
import ReservCard from '../GlobalComponents/reservCard'
import moment from 'moment'
const MyReservations = (props) => {
    const dispatch = useDispatch()
    const { user, myReserves } = useSelector(store => store.user)

    useEffect(() => {
        (async () => {
            let res = await getReservesToUser(user.dni)
            dispatch({ type: 'SET_RESERVES', payload: res })
        })()
    }, [user])

    return (
        <Screen title='Mis reservas' history={props.history} >
            <div className='myEventsContainer' >
                {myReserves.map(({ eventInfo: { eventName, institutionName, date, time }, id, cupos_reservados }) => (
                    <ReservCard
                        id={id}
                        eventName={eventName}
                        date={`${date} - ${time}`}
                        cupos_reservados={cupos_reservados}
                    />
                ))}
            </div>
        </Screen>
    )
}

export default MyReservations