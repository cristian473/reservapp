import React, { useEffect } from 'react'
import Screen from './screen'
import { useDispatch, useSelector } from 'react-redux'
const Settings = (props) => {
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.user)
    useEffect(() => {
        if (!localStorage.getItem('u_data')) {
            props.history.push('/login')
        }
    }, [user])
    return (
        <Screen history={props.history} title='Configuraciones'>
            <button
                className='customButton'
                onClick={() => dispatch({ type: 'CLEAN_STATE' })}
            >
                Cerrar sesión
            </button>
        </Screen>
    )
}

export default Settings