import Screen from "../../GlobalComponents/screen"
import '../../../styles/memberFormStyles.scss'
import { useHistory } from "react-router"

const FirstStep = () => {
    const history = useHistory()

    const handleNextStep = () => {
        history.push(`/form?step=1`)
    }

    return (
        <Screen extendBody title='Solicitud de membresía'>
            <div className="firstStepContainer">
                <p>
                    Por medio de la presente solicito al Consejo Pastoral de la COMUNIDAD CRISTIANA, 
                    con asiento en Libertad 3248, El Talar, Pcia. de Bs. As. se me acepte como miembro de la congregación
                </p>
                <p>
                    Declaro mi intención de participar activamente, asistir fielmente a las actividades, oficios religiosos
                    y asambleas que se convoquen, como asi tambien trabajar en unión y armonía con los hermanos de esta Comunidad.
                </p>
                <p>
                    A tal fin, informo que mis datos personales y de mi familia son los siguientes:
                </p>
                <div className="buttonsContainer">
                    <button className='customButton' onClick={handleNextStep}>Aceptar y continuar</button>
                </div>
            </div>
        </Screen>
    )
}

export default FirstStep