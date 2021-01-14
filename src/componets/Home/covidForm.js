import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import '../../styles/covidFormStyles.scss'
import Swal from 'sweetalert2';

const CovidForm = ({ type, modalOpen, setModalOpen, setConfirmFormCovid }) => {

    const handlerButton = (res) => {
        Swal.fire({
            title: '¡Momento!',
            text: `¿Afirma que ${res.toUpperCase()} tuvo sintomas de covid o tuvo un caso estrecho ${`en los ultimos 14 dias`.toUpperCase()}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si tuve',
            cancelButtonText: 'No tuve',
        }).then(result => {
            if (result.isConfirmed) res = 'si'
            else res = 'no'
            setConfirmFormCovid(res)
        })
        setModalOpen(false)
    }

    return (
        <Dialog
            open={modalOpen}
        >
            <div className="covidFormContainer">
                <div className="text">
                    <p><strong style={{ color: 'rgb(51, 51, 51)' }}>1)</strong>
                        <span style={{ color: 'rgb(51, 51, 51)' }}>¿En las últimas 72 hs experimentaste algún síntoma de fiebre mayor a 37,5° tos, diarrea, vómitos, cefalea, dolor de garganta, dificultad para respirar, pérdida de olfato y/o sabor en forma repentina?</span>
                    </p>
                    <p>·<span style={{ color: 'rgb(51, 51, 51)' }}>Debe contestar </span><strong style={{ color: 'rgb(51, 51, 51)' }}>NO</strong><span style={{ color: 'rgb(51, 51, 51)' }}>, </span>si NO los ha tenido o en caso de haber tenido algunos de esos síntomas a referir ya fue evaluado por un profesional médico y tiene el alta médica</p>
                    <p>·Debe contestar <strong>SI, </strong>si tiene alguno de los síntomas y no ha sido evaluado por un profesional médico.</p>
                    <br />
                    <p><strong>2) </strong>En los últimos 14 días ¿Has tenido contacto estrecho (familiar conviviente o <span style={{ color: 'rgb(51, 51, 51)' }}>conviviente) con algún caso diagnosticado con COVID-19 o que haya sido evaluado clínicamente como caso sospechoso y esté esperando un resultado de la prueba de laboratorio respectiva?</span></p>
                    <p><strong style={{ color: 'rgb(51, 51, 51)' }}>3)</strong><span style={{ color: 'rgb(51, 51, 51)' }}>En los últimos 14 días, ¿recibiste un diagnóstico confirmado “positivo” de COVID19 o has sido evaluado por la evaluación clínica médica como “caso sospechoso” de COVID19 y estás en la espera de la prueba de laboratorio respectiva?</span></p>
                    <br />
                    <p>Si tu respuesta para alguna de las preguntas anteriores es “sí”, selecciona SÍ</p>
                    <p>Si tu respuesta para las cuatro preguntas es “no” selecciona “NO”</p>
                </div>
                <div className="buttonsContainer">
                    <button className='customButton' onClick={() => handlerButton('si')} >SI</button>
                    <button className='customButton' onClick={() => handlerButton('no')} >NO</button>
                </div>
            </div>
        </Dialog>


    )
}

export default CovidForm