import React, { useEffect } from 'react'
import Screen from '../GlobalComponents/screen'
import EventCard from '../GlobalComponents/eventCard'
import '../../styles/myeventsStyles.scss'
import { useSelector, useDispatch } from 'react-redux'
import { getEventsToInstitution } from '../../database'
const MyEvents = (props) => {
    const dispatch = useDispatch()
    const { events, user } = useSelector((store) => store.user)

    useEffect(() => {
        dispatch(getEventsToInstitution(user.email))
    }, [])

    return (
        <Screen title='Mis Eventos' history={props.history}>
            <div className="myEventsContainer">
                {events.map(({ eventName, institutionName, date, code }) => (
                    <EventCard
                        eventName={eventName}
                        institutionName={institutionName}
                        date={date}
                        code={code}
                    />
                ))}
            </div>
        </Screen>
    )
}

export default MyEvents