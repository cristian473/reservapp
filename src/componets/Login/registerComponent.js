import React, { useState } from 'react'

const RegisterComponent = () => {
    const [input, setinputs] = useState({ name: '', tel: '', pass: '', repeatPass: '', email: '' })
    const [insInput, setIntitutionInput] = useState({ institutionName: '', direction: '', pass: '', repeatPass: '', email: '' })
    const [registerType, setType] = useState('person')

    const institutionInput = (e) => {
        const { value, name } = e.target
        setIntitutionInput({ ...insInput, [name]: value })
    }

    const personInput = (e) => {
        const { value, name } = e.target
        setinputs({ ...input, [name]: value })
    }

    const personSubmit = (e) => {
        e.preventDefault()
        console.log(input);
    }
    const institutionSubmit = (e) => {
        e.preventDefault()
        console.log(insInput);
    }
    return (
        <div className="FormContainer">
            <div className="buttonsRegisterContainer">
                <button
                    className={`${registerType === 'person' && 'selected'}`}
                    onClick={() => setType('person')} >
                    Registro de personas
                </button>
                <button
                    className={`${registerType === 'institution' && 'selected'}`}
                    onClick={() => setType('institution')} >
                    Registro de institución
                </button>
            </div>
            {registerType === 'person' && (
                <form onSubmit={personSubmit} >
                    <input className='customInput' required placeholder='Nombre y apellido' id='name' name='name' type="name" onChange={personInput} />
                    <input className='customInput' required placeholder='Numero de telefono' id='tel' name='tel' type="number" onChange={personInput} />
                    <input className='customInput' required placeholder='Correo electronico' id='email' name='email' type="email" onChange={personInput} />
                    <input className='customInput' required placeholder='Contraseña' id='password' name='pass' type="password" onChange={personInput} />
                    <input className='customInput' required placeholder='Repetir contraseña' id='repeatPass' name='repeatPass' type="password" onChange={personInput} />
                    <button type='submit' >Registrarse</button>
                </form>
            )}
            {registerType === 'institution' && (
                <form onSubmit={institutionSubmit} >
                    <input className='customInput' required placeholder='Nombre de la institucion' id='institutionName' name='institutionName' type="text" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Dirección' id='direction' name='direction' type="address" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Correo electronico' id='email' name='email' type="email" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Contraseña' id='password' name='pass' type="password" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Repetir contraseña' id='repeatPass' name='repeatPass' type="password" onChange={institutionInput} />
                    <button type='submit' >Registrarse</button>
                </form>
            )}
        </div>
    )
}

export default RegisterComponent