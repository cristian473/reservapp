import React from 'react'
import Screen from '../GlobalComponents/screen'
const reservasInfo = (props) => {
    const { match: { params: { code } } } = props;

    return (
        <Screen title='Participantes' history={props.history} >
            <div className="participantesContainer">

            </div>
        </Screen>
    )
}
export default reservasInfo