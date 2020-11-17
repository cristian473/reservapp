import React, { useState } from 'react'
import { authenticate } from '../../database'
import { useDispatch } from 'react-redux'
const LoginComponent = () => {
    const dispatch = useDispatch()
    const [input, setinputs] = useState({ DNI: '', pass: '' })

    const handlerInput = (e) => {
        const { value, name } = e.target
        setinputs({ ...input, [name]: value })
    }

    const handlerSubmit = async (e) => {
        e.preventDefault()
        let user = await authenticate(input)
        if (user) {
            localStorage.setItem('u_data', JSON.stringify(user.dni.replace(/\./, '')))
            dispatch({ type: 'LOGGED', payload: user })
        } else {
            console.error(user);
        }
    }
    return (
        <div className="FormContainer">
            <form onSubmit={handlerSubmit} >
                <input className='customInput' required id='DNI' placeholder='DNI' name='DNI' type="DNI" onChange={handlerInput} />
                <input className='customInput' required id='password' placeholder='Contraseña' name='pass' type="password" onChange={handlerInput} />
                <button type='submit' >Iniciar sesion</button>
            </form>
        </div>
    )
}

export default LoginComponent