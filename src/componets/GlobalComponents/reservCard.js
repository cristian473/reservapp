import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/eventCardStyles.scss'
const ReservCard = ({ cupos_reservados, eventName, date, id }) => {
    return (
        <Link to={`/reservation/${id}`}>
            <div className="event">
                <span>
                    {`${eventName}`}
                </span>
                <span>
                    {`${date}`}
                </span>
                <span>
                    {`${cupos_reservados} cupos reservados`}
                </span>
            </div>
        </Link>
    )
}
export default ReservCard
