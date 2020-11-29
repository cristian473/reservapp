import React from "react";
import ReactExport from "react-data-export";
import moment from 'moment'
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Download = ({ reservToExcel, day }) => {
    return (
        <ExcelFile filename={`Reservas ${day}`} element={<button className='customButton white'>Descargar en excel</button>}>
            <ExcelSheet data={reservToExcel} name="Reservas">
                <ExcelColumn label="Apellido" value="lastName" />
                <ExcelColumn label="Nombre" value="name" />
                <ExcelColumn label="Registrado por" value="registeredFor" />
                <ExcelColumn label="Covid" value="form" />
                <ExcelColumn label="Contacto" value="contact" />
            </ExcelSheet>
        </ExcelFile>
    );
}

export default Download