import React, { useState } from 'react'

const LoginComponent = () => {
    const [input, setinputs] = useState({ email: '', pass: '' })

    const handlerInput = (e) => {
        const { value, name } = e.target
        setinputs({ ...input, [name]: value })
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
        console.log(input);
    }
    return (
        <div className="FormContainer">
            <form onSubmit={handlerSubmit} >
                <input className='customInput' required id='email' placeholder='Email' name='email' type="email" onChange={handlerInput} />
                <input className='customInput' required id='password' placeholder='Contraseña' name='pass' type="password" onChange={handlerInput} />
                <button type='submit' >Iniciar sesion</button>
            </form>
        </div>
    )
}

export default LoginComponent