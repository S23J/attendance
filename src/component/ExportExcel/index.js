import React from 'react';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import { RiFileExcel2Line } from "react-icons/ri";

const ExportExcel = ( props ) =>
{
    const fileType = `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8`;
    const fileExtension = '.xlsx';

    const exportToExcel = async () =>
    {
        const ws = XLSX.utils.json_to_sheet( props.excelData );
        const wb = { Sheets: { 'data': ws }, SheetNames: [ 'data' ] };
        const excelBuffer = XLSX.write( wb, { bookType: 'xlsx', type: 'array' } );

        const data = new Blob( [ excelBuffer ], { type: fileType } );
        FileSaver.saveAs( data, props.fileName + fileExtension );
    };

    return (
        <>
            <RiFileExcel2Line
                style={ { backgroundColor: 'transparent', color: 'green' } }
                size={ 40 }
                onClick={ ( e ) => exportToExcel( props.fileName ) }
            />
        </>
    );
};

export default ExportExcel
