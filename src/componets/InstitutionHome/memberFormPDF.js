import moment from 'moment'
import '../../styles/formPDF.scss'

const initialState={
    personalData: {},
    baptismData: {},
    convertionData: {},
    integrantsData: [],
    signature: {}
}



export const MemberFormPDF = ({formData = initialState}) => {
    const {
        personalData,
        baptismData,
        convertionData,
        integrantsData,
        signature
    } = formData

    const capitalize = (str='', lower = false) =>(
        (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
    );

    return (
        <div className="pdf--container">
            <div className="pdf--title">
                <h1>SOLICITUD DE MEMBRESÍA</h1>
            </div>
            <div className="pdf--prologo">
                <p>
                    Por medio de la presente solicito al Consejo Pastoral de la COMUNIDAD CRISTIANA, 
                    con asiento en Libertad 3248, El Talar, Pcia. de Bs. As. se me acepte como miembro de la congregación.
                </p>
                <p>
                    Declaro mi intención de participar activamente, asistir fielmente a las actividades, oficios religiosos
                    y asambleas que se convoquen, como asi tambien trabajar en unión y armonía con los hermanos de esta Comunidad.
                </p>
                <p>
                    A tal fin, informo que mis datos personales y de mi familia son los siguientes:
                </p>
            </div>
            <div className="pfd--personalData">
                <div className="pdf--column">
                    <div className="pdf--separator-section"></div>
                    <p className='pdf--subtitle'>DATOS PERSONALES: </p>
                    <p><b>Apellido y nombre:</b> {capitalize(personalData?.name) || ' - '}</p>
                    <div className="pdf--row">
                        <div className="pdf--column  cl50">
                            <p><b>DNI N°:</b> {personalData?.dni || ' - '}</p>
                            <p><b>Fecha de nacimiento:</b> {moment(personalData?.fechaNac, 'YYYY-MM-DD').format('DD/MM/YYYY') || ' - '}</p>
                        </div>
                        <div className="pdf--column  cl50">
                            <p><b>Nacionalidad:</b> {personalData?.nacionalidad || ' - '}</p>
                            <p><b>Lugar de Nac:</b> {personalData?.lugarNac || ' - '}</p>
                        </div>
                    </div>
                    <div className="pdf--separator-section"></div>
                    <p className='pdf--subtitle'>DOMICILIO: </p>
                    <div className="pdf--row">
                        <div className="pdf--column cl50">
                            <p><b>Calle: </b> {personalData?.calle || ' - '}</p>
                            <p><b>N°: </b> {personalData?.calleNro || ' - '}</p>
                        </div>
                        <div className="pdf--column cl50">
                            <p><b>Localidad: </b> {personalData?.localidad || ' - '}</p>
                            <p><b>Partido: </b> {personalData?.partido || ' - '}</p>
                        </div>
                    </div>
                    <div className="pdf--row">
                        <div className="pdf--column cl50">
                            <p><b>Código Postal: </b> {personalData?.cp || ' - '}</p>
                            <p><b>Provincia: </b> {personalData?.provincia || ' - '}</p>
                        </div>
                        <div className="pdf--column cl50">
                            <p><b>Teléfono: </b> {personalData?.tel || ' - '}</p>
                            <p><b>Email: </b> <small>{personalData?.email || ' - '}</small></p>
                        </div>
                    </div>
                    <div className="pdf--separator-section"></div>
                    <div className="pdf--row">
                        <div className="pdf--column cl50">
                            <p><b>Estado Civil: </b> {personalData?.estadoCivil || ' - '}</p>
                        </div>
                        <div className="pdf--column cl50">
                            <p><b>Año de casamiento: </b> {personalData?.añoCasamiento || ' - '}</p>
                        </div>
                    </div>
                    {personalData?.estadoCivil?.includes('Divociado/a', 'Soltero/a') && (
                        <>
                            <div className="pdf--row">
                                <small>(Si se encuentra separado o divoriado explique brevemente el motivo de la desolución conyugal) {personalData?.separadoMotivo}</small>
                            </div>
                            <div className="pdf--separator-section"></div>
                        </>
                    )}
                    <div className="pdf--row">
                        <div className="pdf--column cl50">
                            <p><b>Profesión: </b>{personalData?.profesion || ' - '}</p>
                        </div>
                        <div className="pdf--column cl50">
                            <p><b>Estudios cursados: </b> {personalData?.estudiosCursados || ' - '}</p>
                        </div>
                    </div>
                    <div className="pdf--row">
                        <p><b>Otros estudios cursados: </b> {personalData?.otrosEstudiosCursados || ' - '}</p>
                    </div>
                    <div className="pdf--separator-section"></div>
                    <p className='pdf--subtitle'>{`Personas con las que convive en la misma casa o domicilio:`.toLocaleUpperCase()}</p>
                    <div className="pdf--row">
                        <div className="pdf--column cl25">
                            <p className='pdf--text_with_underline' ><b>Nombre y apellido</b></p>
                            {integrantsData?.length > 0 ? 
                                integrantsData?.map((el) => <p className='pdf--text_with_underline' >{el.nombreCompleto || ' - '}</p>) 
                                : <p className='pdf--text_with_underline' >___________________________</p>}                                                                                    
                        </div>
                        <div className="pdf--column cl25">
                            <p className='pdf--text_with_underline' ><b>Parentezco</b></p>
                            {integrantsData?.length > 0 ? 
                                integrantsData?.map((el) => <p className='pdf--text_with_underline' >{el.parentesco || ' - '}</p>) 
                                : <p className='pdf--text_with_underline' >___________________________</p>}                                                        
                        </div>
                        <div className="pdf--column cl25">
                            <p className='pdf--text_with_underline' ><b>Edad</b></p>
                            {integrantsData?.length > 0 ? 
                                integrantsData?.map((el) => <p className='pdf--text_with_underline' >{el.edad || ' - '}</p>) 
                                : <p className='pdf--text_with_underline' >___________________________</p>}                                                        
                        </div>
                        <div className="pdf--column cl25">
                            <p className='pdf--text_with_underline lastcolumn' ><b>DNI</b></p>
                            {integrantsData?.length > 0 ? 
                                integrantsData?.map((el) => <p className='pdf--text_with_underline lastcolumn' >{el.dni || ' - '}</p>) 
                                : <p className='pdf--text_with_underline lastcolumn' >___________________________</p>}                                                        
                        </div>
                    </div>
                    <div className="pdf--separator-section"></div>
                    <p className='pdf--subtitle'>CONVERSIÓN:</p>
                    <div className="pdf--row">
                        <div className="pdf--column cl25">
                            <p><b>Fecha:</b> {convertionData?.convertionDate ? moment(convertionData?.convertionDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : ' - '}</p>
                        </div>
                        <div className="pdf--column">
                            <p><b>Lugar:</b> {convertionData?.convertionPlace || ' - '}</p>
                        </div>
                    </div>
                    <div className="pdf--row">
                        <p><b>Nombre de la iglesia y pastor:</b> {convertionData?.convertionMinister || ' - '}</p>
                    </div>
                    <div className="pdf--separator-section"></div>
                    <p className='pdf--subtitle'>BAUTISMO (Marcos 16:16 - Mateo 28:19 - Hechos 2:38): </p>
                    <div className="pdf--row">
                        <p><b>¿Fue bautizado en las aguas según las Escrituras?</b></p>
                    </div>
                    <div className="pdf--row">
                        <p> {baptismData?.isBaptism === 'true' ? ' - Si, fui bautizado/a.' : ' - No fui bautizado/a.'}</p>
                    </div>
                    {baptismData?.isBaptism === 'true' && (
                        <>
                            <div className="pdf--row">
                                <p><b>Nombre de la iglesia y pastor:</b> {baptismData?.baptismPlace || ' - '} - {baptismData?.baptismMinister || ' - '} </p>
                            </div>
                            <div className="pdf--row">
                                <p><b>Fecha del bautismo:</b> {moment(baptismData?.baptismDate, 'YYYY-MM-DD').format('DD/MM/YYYY') || ' - '}</p>
                            </div>
                        </>
                    )}
                    <div className="pdf--separator-section"></div>
                    <div className="pdf--row center">
                        <p style={{marginBottom: '50px'}}>Saludo a Uds. muy atte.</p>
                        <p className='pdf--signature'>{capitalize(personalData?.name) || capitalize(signature?.text) }</p>
                    </div>
                    <div className="pdf--row center">
                        <small>El consejo Pastoral de esta Congregación se reserva los derechos de admitirle como miembro.</small>
                    </div>
                    <div className="pdf--separator-section"></div>
                </div>
            </div>
        </div>
    )
}