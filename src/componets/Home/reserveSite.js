import React, { useState } from 'react'
import Screen from '../GlobalComponents/screen'
import ReserveForm from './reserveForm'
import { SubscribeEvent } from '../../database'
import '../../styles/reserveStyles.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserFriends, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
const ReserveSite = (props) => {
    const [siteFor, setFor] = useState('')
    const [inputsStyle, setInputStyles] = useState(false)

    const handlerReserve = async (type, data) => {
        Swal.showLoading()
        const res = await SubscribeEvent({ ...data, type: type })
        if (res === true) {
            await Swal.fire('Éxito!', `Lugares reservados`, 'success')
            props.history.push('/')
        } else if (res === false) {
            Swal.fire('Error!', `intente nuevamente`, 'error')
        } else if (res === undefined) {
            props.history.push('/reservations')
        }
    }

    return (
        <Screen history={props.history} title='Complete los datos' extendBody={inputsStyle} >
            <div className={`reserveContainer ${inputsStyle && 'inputsStyle'}`}>
                {!siteFor && (
                    <>
                        <button className='customButton Block' onClick={() => setFor('me')} >
                            <FontAwesomeIcon icon={faUser} />
                            Para mi
                        </button>
                        <button className='customButton Block' onClick={() => setFor('other')} >
                            <FontAwesomeIcon icon={faUserFriends} />
                            Para otro
                        </button>
                        <button className='customButton Block' onClick={() => setFor('family')} >
                            <FontAwesomeIcon icon={faUsers} />
                            Para un grupo familiar
                        </button>
                    </>
                )}
                {siteFor === 'me' && <ReserveForm setInputStyles={setInputStyles} sendReserve={handlerReserve} type='me' />}
                {siteFor === 'other' && <ReserveForm setInputStyles={setInputStyles} sendReserve={handlerReserve} type='other' />}
                {siteFor === 'family' && <ReserveForm setInputStyles={setInputStyles} sendReserve={handlerReserve} type='family' />}
            </div>
        </Screen>
    )
}
export default ReserveSite