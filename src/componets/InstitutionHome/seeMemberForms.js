import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getFormsByInstitution } from "../../database";
import Screen from "../GlobalComponents/screen";
import '../../styles/eventCardStyles.scss'
import ReactToPrint from "react-to-print";
import { MemberFormPDF } from "./memberFormPDF";

const MemberFormList = () => {
    const { user } = useSelector((store) => store.user)
    const [forms, setForms] = useState([])
    const history = useHistory()

    useEffect(() => {
        getFormsByInstitution('comunidadcristianadontorcuato@gmail.com').then(setForms)
    }, [user.email])

    const getCurrentRef = (i) => document.querySelector(`#event_${i}`)

    return (
        <Screen extendBody={true} title='Formularios completados' history={history}>
            {forms.map((formData, i) => {
                return (
                    <div key={i} className="event" >
                        <span>{formData.personalData.name}</span>
                        <ReactToPrint
                            documentTitle={`${formData.personalData.name} - formulario de miembro 2021`}
                            trigger={() => (
                                <button className='customButton white' >{'Descargar'}</button>
                            )}
                            content={() => getCurrentRef(i)}
                        />
                        <div style={{display: 'none'}}>
                            <div id={`event_${i}`} className="wrapper">
                                <MemberFormPDF formData={formData}/>
                            </div>
                        </div>
                    </div>
                )
            })}

        </Screen>
    )
}

export default MemberFormList;