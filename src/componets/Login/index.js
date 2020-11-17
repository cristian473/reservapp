import React, { useState } from 'react'
import LoginComponent from './loginComponent'
import RegisterComponent from './registerComponent'
import '../../styles/loginStyles.scss'

const Login = (props) => {
    const [formType, setForm] = useState('initial')
    return (
        <div className="loginContainer">
            {formType === 'initial' && (
                <div className="buttonContainer">
                    <button onClick={() => setForm('login')} >Iniciar sesión</button>
                    <button onClick={() => setForm('register')} >Registrarse</button>
                    <span>Olvidé mi contraseña</span>
                </div>
            )}
            {formType === 'login' && (
                <LoginComponent />
            )}
            {formType === 'register' && (
                <RegisterComponent history={props.history} />
            )}
        </div>
    )
}
export default Login