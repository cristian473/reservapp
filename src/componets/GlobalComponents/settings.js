import React from 'react'
import Screen from './screen'

const Settings = (props) => {
    return (
        <Screen history={props.history} title='Configuraciones'>
            <div className="settingsContainer">
                Settings
            </div>
        </Screen>
    )
}

export default Settings