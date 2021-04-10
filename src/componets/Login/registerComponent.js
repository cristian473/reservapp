import React, { useState } from 'react'
import { createInstitution, createUser } from '../../database'
const RegisterComponent = ({ history }) => {
    const [input, setinputs] = useState({ name: '', tel: '', dni: '', email: '' })
    const [insInput, setIntitutionInput] = useState({ institutionName: '', address: '', pass: '', repeatPass: '', email: '', creator_id: '' })
    const [registerType, setType] = useState('person')
    
    const institutionInput = (e) => {
        const { value, name } = e.target
        setIntitutionInput({ ...insInput, [name]: value })
    }

    const personInput = (e) => {
        const { value, name } = e.target
        setinputs({ ...input, [name]: value })
    }

    const personSubmit = async (e) => {
        e.preventDefault()
        let res = await createUser(input);
        if (res) {
            history.go()
        } else {
            return null
        }
    }
    const institutionSubmit = async (e) => {
        e.preventDefault()
        let res = await createInstitution(insInput);
        if (res) {
            history.go()
        } else {
            return null
        }
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
                    <input className='customInput' placeholder='N° telefono' id='tel' name='tel' type="number" onChange={personInput} />
                    <input className='customInput' placeholder='Email (opcional)' id='email' name='email' type="email" onChange={personInput} />
                    <input className='customInput' required placeholder='DNI (sin puntos)' id='dni' name='dni' type="dni" onChange={personInput} />
                    <button type='submit' >Registrarse</button>
                </form>
            )}
            {registerType === 'institution' && (
                <form onSubmit={institutionSubmit} >                    
                    <input className='customInput' required placeholder='Nombre de la institucion' id='institutionName' name='institutionName' type="text" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Dirección' id='direction' name='address' type="address" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Correo electronico' id='email' name='email' type="email" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Contraseña' id='password' name='pass' type="password" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Repetir contraseña' id='repeatPass' name='repeatPass' type="password" onChange={institutionInput} />
                    <input className='customInput' required placeholder='Cod. de identificación' id='creator_id' name='creator_id' type="text" onChange={institutionInput} />
                    <small>Debe ser único y corto ya que lo van a usar los usuarios para vincularse con su institución</small>
                    <button type='submit' >Registrarse</button>
                </form>
            )}
        </div>
    )
}

export default RegisterComponent