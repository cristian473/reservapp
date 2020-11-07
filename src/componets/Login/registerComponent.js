import React, { useState } from 'react'

const RegisterComponent = () => {
    const [input, setinputs] = useState({ name: '', tel: '', pass: '', repeatPass: '', email: '' })

    const handlerInput = (e) => {
        const { value, name } = e.target
        setinputs({ ...input, [name]: value })
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <div className="FormContainer">
            <form onSubmit={handlerSubmit} >
                <input required placeholder='Nombre y apellido' id='name' name='name' type="name" onChange={handlerInput} />
                <input required placeholder='Numero de telefono' id='tel' name='tel' type="number" onChange={handlerInput} />
                <input required placeholder='Correo electronico' id='email' name='email' type="email" onChange={handlerInput} />
                <input required placeholder='Contraseña' id='password' name='pass' type="password" onChange={handlerInput} />
                <input required placeholder='Repetir contraseña' id='repeatPass' name='repeatPass' type="password" onChange={handlerInput} />
                <button type='submit' >Registrarse</button>
            </form>
        </div>
    )
}

export default RegisterComponent