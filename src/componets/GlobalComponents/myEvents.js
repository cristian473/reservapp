import React, { useEffect } from 'react'
import Screen from './screen'
import EventCard from './eventCard'
import '../../styles/myeventsStyles.scss'
import { useSelector, useDispatch } from 'react-redux'
import { getEventsToInstitution, getEventsByInstitution } from '../../database'
const MyEvents = (props) => {
    const dispatch = useDispatch()
    const { events, user } = useSelector((store) => store.user)

    useEffect(() => {
        if (user.type === 'institution') {
            dispatch(getEventsToInstitution(user.email))
        } else if (user.type === 'person' && user.institution_subscribed && user.institution_subscribed.length > 0) {
            dispatch(getEventsByInstitution(user.institution_subscribed))
        }
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