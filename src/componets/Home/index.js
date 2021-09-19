import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faBookmark, faCog } from '@fortawesome/free-solid-svg-icons'
import '../../styles/homeStyles.scss'
import '../../styles/institutionStyles.scss'
import { checkForm, getEventsByInstitution } from '../../database'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'

const Home = (props) => {
    const dispatch = useDispatch()
    const [code, setcode] = useState('')
    const { user } = useSelector((store) => store.user)

    useEffect(() => {
        if (user.institution_subscribed && user.institution_subscribed.length > 0) {
            dispatch(getEventsByInstitution(user.institution_subscribed))
        } else {
            Swal.fire('Momento!', 'Usted no está vinculado a ninguna institución aún, por favor ingrese el cod. para comenzar a ver sus eventos', 'warning')
            .then(() => props.history.push('/settings'))
        }
        //checkea si no hizo el formulario
        if(user.memberFormCompleted) return;

        if(user.institution_subscribed.includes("comunidadcristianadontorcuato@gmail.com") && ['41464156', '33021649'].includes(user.dni)){
            checkForm('comunidadcristianadontorcuato@gmail.com', user.dni)
            .then((response) => {
                if(response.isConfirmed) redirectTo(`/form?step=1`)            
            })
        }
    }, [user])

    const redirectTo = (path) => {
        props.history.push(path)
    }

    return (
        <div className="homeContainer">
            <div className="title">
                <h2>
                    {`Hola, ${user.name.split(' ')[0]}!`}
                </h2>
            </div>
            <div className={`body ${code.length > 0 && 'typingCode'}`} >
                <div className="option createEvent" onClick={() => redirectTo('/next_events')} >
                    <FontAwesomeIcon icon={faCalendarDay} />
                    <h5>Próximos eventos</h5>
                </div>
                <div className="option" onClick={() => redirectTo('/reservations')}>
                    <FontAwesomeIcon icon={faBookmark} />
                    <h5>Mis reservas</h5>
                </div>
                <div className="option" onClick={() => redirectTo('/settings')}>
                    <FontAwesomeIcon icon={faCog} />
                    <h5>Configuraciones</h5>
                </div>

                {/* {events.length === 0 && (
                    <>
                        <div className="myEvents">
                            <FontAwesomeIcon icon={faCalendarDay} />
                            <h5>Mis eventos</h5>
                        </div>
                        <div className="eventsContainer">
                            <h5 className='noEvents'>
                                No tienes eventos aún
                            </h5>
                        </div>
                    </>
                )}
                {events.length > 0 && (
                    <div className="option" onClick={() => redirectTo('/my_events')}>
                        <FontAwesomeIcon icon={faBookmark} />
                        <h5>Mis eventos</h5>
                    </div>
                )}
                <div className="inputCode">
                    <h5>Codigo de institución o evento:</h5>
                    <input type="text" placeholder='Ingresar código' className='customInput' value={code} onChange={(e) => setcode(e.target.value)} />
                    {code.length > 0 && <button onClick={subscribeEvent} className='customButton'>Confirmar</button>}
                </div>
                <button className='customButton' onClick={() => dispatch({ type: 'CLEAN_STATE' })} >Cerrar sesión</button> */}
            </div>
        </div >
    )
}
export default Home