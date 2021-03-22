import React, { useEffect, useState } from 'react'
import Screen from './screen'
import { useDispatch, useSelector } from 'react-redux'
import { subscribeInstitutionQuery } from '../../database'
import Swal from 'sweetalert2'
const Settings = (props) => {
    const dispatch = useDispatch()
    const [code, setcode] = useState('')
    const { user } = useSelector(store => store.user)
    useEffect(() => {
        if (!localStorage.getItem('u_data')) {
            props.history.push('/login')
        }
    }, [user])

    const subscribeEvent = async () => {
        Swal.showLoading()
        let res = await subscribeInstitutionQuery(code, user)
        if (res) {
            await Swal.fire('Éxito!', `ahora puedes ver los eventos de ${res}`, 'success')
            props.history.go()
            props.history.push('/')
        }
    }

    return (
        <Screen history={props.history} title='Configuraciones'>
            <div className='d-flex flex-column justify-content-around aling-items-center align-items-center' style={{ height: '100%' }}>
                {user.type === 'person' && (
                    <div className="inputCode">
                        <h5>Código de institución:</h5>
                        <input type="text" placeholder='Ingresar código' className='customInput' value={code} onChange={(e) => setcode(e.target.value)} />
                        {code.length > 0 && <button onClick={subscribeEvent} className='customButton'>Confirmar</button>}
                    </div>
                )}
                <button
                    className='customButton'
                    onClick={() => dispatch({ type: 'CLEAN_STATE' })}
                >
                    Cerrar sesión
                </button>
            </div>
        </Screen>
    )
}

export default Settings