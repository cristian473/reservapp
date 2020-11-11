import React from 'react'
import Screen from '../GlobalComponents/screen'
const MyEvents = (props) => {
    return (
        <Screen title='Mis Eventos' history={props.history}>
            <div className="myEventscontainer">
                MyEvents
        </div>
        </Screen>
    )
}

export default MyEvents