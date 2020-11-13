import React from 'react'
import Screen from '../GlobalComponents/screen'
import EventCard from '../GlobalComponents/eventCard'
import '../../styles/myeventsStyles.scss'
const MyEvents = (props) => {

    const events = [
        {
            eventName: 'Reunión general',
            institutionName: 'Comunidad CDT',
            date: 'Sábado 18hs',
            code: 3557
        },
        {
            eventName: 'Reunión general',
            institutionName: 'Comunidad CDT',
            date: 'Sábado 18hs',
            code: 3557
        },
        {
            eventName: 'Reunión general',
            institutionName: 'Comunidad CDT',
            date: 'Sábado 18hs',
            code: 3557
        },
        {
            eventName: 'Reunión general',
            institutionName: 'Comunidad CDT',
            date: 'Sábado 18hs',
            code: 3557
        },
        {
            eventName: 'Reunión general',
            institutionName: 'Comunidad CDT',
            date: 'Sábado 18hs',
            code: 3557
        },
        {
            eventName: 'Reunión general',
            institutionName: 'Comunidad CDT',
            date: 'Sábado 18hs',
            code: 3557
        },
        {
            eventName: 'Reunión general',
            institutionName: 'Comunidad CDT',
            date: 'Sábado 18hs',
            code: 3557
        },
        {
            eventName: 'Reunión general',
            institutionName: 'Comunidad CDT',
            date: 'Sábado 18hs',
            code: 3557
        }
    ]

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