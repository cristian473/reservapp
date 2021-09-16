import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import '../../styles/screen.scss'
import { useHistory } from 'react-router'

const Screen = ({ title, children, history, arrowBack = true, extendBody }) => {
    const HistoryHook = useHistory()
    return (
        <div className="screen">
            {arrowBack && (
                <div className="backArrow" onClick={() => history?.goBack() || HistoryHook.goBack()} >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
            )}
            <div className="title">
                <h3>{title}</h3>
            </div>
            <div className={`body ${extendBody && 'extendBody'}`}>
                {children}
            </div>
        </div>
    )
}

export default Screen