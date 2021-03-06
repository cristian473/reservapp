import React, { useState } from 'react'
import { authenticate } from '../../database'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
const LoginComponent = () => {
    const dispatch = useDispatch()
    const [input, setinputs] = useState({ DNI: '', pass: '' })

    const handlerInput = (e) => {
        const { value, name } = e.target
        setinputs({ ...input, [name]: value })
    }

    const handlerSubmit = async (e) => {
        e.preventDefault()
        Swal.fire({ title: 'Iniciando sesión' })
        Swal.showLoading()
        let user = await authenticate(input)
        if (user && user.dni) {
            localStorage.setItem('u_data', JSON.stringify(user.dni.replace(/\./, '')))
            dispatch({ type: 'LOGGED', payload: user })
            Swal.close()
        } else if (user && !user.dni) {
            localStorage.setItem('u_data', JSON.stringify(user.email))
            dispatch({ type: 'LOGGED', payload: user })
            Swal.close()
        }
    }
    return (
        <div className="FormContainer">
            <form onSubmit={handlerSubmit} >
                <input className='customInput' required id='DNI' placeholder='DNI (sin puntos)' name='DNI' type="DNI" onChange={handlerInput} />
                {input.DNI.includes('@') &&
                    <input className='customInput' required id='password' placeholder='Contraseña' name='pass' type="password" onChange={handlerInput} />
                }
                <button type='submit' >Ingresar</button>
            </form>
        </div>
    )
}

export default LoginComponent