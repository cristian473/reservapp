import React, { useState, useEffect } from 'react'
import Screen from '../GlobalComponents/screen'
import '../../styles/participantesStyles.scss'
import { getPersonsByEvent } from '../../database'
import { CircularProgress } from '@material-ui/core'
const ReservasInfo = (props) => {
    const { match: { params: { code } } } = props;
    const [reservas, setReservas] = useState([])
    useEffect(() => {
        if (code) {
            (async () => {
                let res = await getPersonsByEvent(code)
                setReservas(res)
            })()
        }
    }, [code])
    return (
        <Screen title='Participantes' history={props.history} >
            <div className="participantesContainer">
                {reservas.length > 0 ? (
                    reservas.map((r) => (
                        <>
                            {r.type === 'family' && (
                                <div className="reservaCard">
                                    <h5>Nombre de la familia: <br /> <span>{r.familyName} </span> </h5>
                                    <h5>Registrado por: <br />  <span>{r.registeredFor.name} </span> </h5>
                                    <h5>Cupos:  <span>{r.cupos_reservados} </span> </h5>
                                    <h5>Integrantes:</h5>
                                    <ul>
                                        {r.integrants.map((i) => (
                                            <li>{i}</li>
                                        ))}
                                    </ul>
                                    <h5>Sintoma o contacto con cv19: <span> {r.acceptFormCovid} </span> </h5>
                                </div>
                            )}
                            {r.type === 'other' && (
                                <div className="reservaCard">
                                    <h5>Nombre: <br /><span> {r.personName} </span> </h5>
                                    <h5>Registrado por:  <br /><span>{r.registeredFor.name} </span> </h5>
                                    <h5>Cupos: <span> {r.cupos_reservados} </span> </h5>
                                    <h5>Sintoma o contacto con cv19: <span> {r.acceptFormCovid} </span> </h5>
                                </div>
                            )}
                            {r.type === 'me' && (
                                <div className="reservaCard">
                                    <h5>Nombre: <br /> <span>{r.registeredFor.name} </span> </h5>
                                    <h5>Cupos:  <span>{r.cupos_reservados} </span> </h5>
                                    <h5>Sintoma o contacto con cv19:  <span>{r.acceptFormCovid} </span> </h5>
                                </div>
                            )}
                        </>
                    ))
                ) : (
                        <CircularProgress />
                    )}
            </div>
        </Screen>
    )
}
export default ReservasInfo