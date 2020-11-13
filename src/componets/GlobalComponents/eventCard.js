import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/eventCardStyles.scss'
const EventCard = ({ eventName, institutionName, date, code }) => {
    return (
        <Link to={`/event/${code}`}>
            <div className="event">
                <span>
                    {`${eventName} en`}
                </span>
                <span>
                    {`${institutionName}`}
                </span>
                <span>
                    {`${date}`}
                </span>
            </div>
        </Link>
    )
}
export default EventCard
