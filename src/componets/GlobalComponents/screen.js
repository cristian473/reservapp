import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import '../../styles/screen.scss'

const Screen = ({ title, children, history, arrowBack = true, extendBody }) => {

    return (
        <div className="screen">
            {arrowBack && (
                <div className="backArrow" onClick={() => history.goBack()} >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
            )}
            <div className="title">
                <h2>{title}</h2>
            </div>
            <div className={`body ${extendBody && 'extendBody'}`}>
                {children}
            </div>
        </div>
    )
}

export default Screen