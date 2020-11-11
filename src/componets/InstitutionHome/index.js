import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faBookmark, faCog } from '@fortawesome/free-solid-svg-icons'
import '../../styles/institutionStyles.scss'
import Screen from '../GlobalComponents/screen'
const InstitutionHome = (props) => {

    const institution = {
        institutionName: '',
        direction: '',
        email: ''
    }
    const redirectTo = (path) => {
        props.history.push(path)
    }

    return (
        <Screen title={'Comunidad cristiana Don Torcuato'} arrowBack={false}>
            <div className="institutionHomeContainer">
                <div className="option createEvent" onClick={() => redirectTo('/create_event')} >
                    <FontAwesomeIcon icon={faCalendarPlus} />
                    <h5>Crear evento</h5>
                </div>
                <div className="option" onClick={() => redirectTo('/my_events')}>
                    <FontAwesomeIcon icon={faBookmark} />
                    <h5>Mis eventos</h5>
                </div>
                <div className="option" onClick={() => redirectTo('/settings')}>
                    <FontAwesomeIcon icon={faCog} />
                    <h5>Configuraciones</h5>
                </div>
            </div>
        </Screen>

    )
}

export default InstitutionHome