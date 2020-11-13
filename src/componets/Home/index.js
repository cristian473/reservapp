import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import EventCard from '../GlobalComponents/eventCard'
import '../../styles/homeStyles.scss'
import { Link } from 'react-router-dom'
const Home = () => {
    const [code, setcode] = useState('')
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
        }
    ]

    return (
        <div className="homeContainer">
            <div className="title">
                <h2>
                    Hola, cristian!
                </h2>
            </div>
            <div className={`body ${code.length > 0 && 'typingCode'}`} >
                <div className="myEvents">
                    <FontAwesomeIcon icon={faCalendarDay} />
                    <h5>Mis eventos</h5>
                </div>
                {events.length === 0 && (
                    <div className="eventsContainer">
                        <h5 className='noEvents'>
                            No tienes eventos aún
                        </h5>
                    </div>
                )}
                {events.length > 0 && (
                    <div className='eventsContainer'>
                        {events.map(({ eventName, institutionName, date, code }) => (
                            <EventCard
                                eventName={eventName}
                                institutionName={institutionName}
                                date={date}
                                code={code}
                            />
                        ))}
                    </div>
                )}
                <div className="inputCode">
                    <h5>Codigo de institución o evento:</h5>
                    <input type="text" placeholder='Ingresar código' className='customInput' value={code} onChange={(e) => setcode(e.target.value)} />
                    {code.length > 0 && <button className='customButton'>Confirmar</button>}
                </div>
            </div>
        </div >
    )
}

export default Home