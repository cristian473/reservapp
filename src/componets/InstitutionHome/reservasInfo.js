import React, { useState, useEffect } from 'react'
import Screen from '../GlobalComponents/screen'
import '../../styles/participantesStyles.scss'
import { getPersonsByEvent } from '../../database'
import { CircularProgress } from '@material-ui/core'
import Download from '../GlobalComponents/exportToExcel'
const ReservasInfo = (props) => {
    const { match: { params: { code } } } = props;
    const [reservas, setReservas] = useState([])
    const [dataExcel, setDataExcel] = useState([])
    const exportData = (data) => {
        let arr = []
        data.forEach((r) => {
            let o = {}
            switch (r.type) {
                case 'family':
                    o.lastName = r.familyName
                    o.registeredFor = r.registeredFor.name
                    o.form = r.acceptFormCovid
                    o.contact = r.registeredFor.tel || r.registeredFor.email || '-'
                    r.integrants.forEach((int) => {
                        arr.push({ ...o, name: int })
                    })
                    break;
                case 'me':
                    o.lastName = r.registeredFor.name.split(' ')[1] || '-'
                    o.name = r.registeredFor.name.split(' ')[0] || '-'
                    o.registeredFor = '-'
                    o.form = r.acceptFormCovid
                    o.contact = r.registeredFor.tel || r.registeredFor.email || '-'
                    arr.push(o)
                    break;
                case 'other':
                    o.lastName = r.personName.split(' ')[1] || '-'
                    o.name = r.personName.split(' ')[0] || '-'
                    o.registeredFor = r.registeredFor.name
                    o.form = r.acceptFormCovid
                    o.contact = r.registeredFor.tel || r.registeredFor.email || '-'
                    arr.push(o)
                    break;
                default:
                    break;
            }
        })
        arr.sort(((a, b) => a.lastName.localeCompare(b.lastName)))
        setDataExcel(arr)
    }

    useEffect(() => {
        if (code) {
            (async () => {
                let res = await getPersonsByEvent(code)
                exportData(res)
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
            {dataExcel.length > 0 && reservas.length > 0 && (
                <Download reservToExcel={dataExcel} day={reservas[0].eventInfo.date} /> 
            )}
        </Screen>
    )
}
export default ReservasInfo