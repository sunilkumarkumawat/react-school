import React from 'react'
import AppImage from '../../utils/AppImage'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExcelUpload = ({columns,setExcelData,file,fileName}) => {

     const exportUserSample = () => {
        const excludeFields = { branch_id: true, image: true, role_id: true, password: true, username: true, gender_id: true }
        const fields = columns
          .flatMap(group => group.fields)
          .filter(field => !excludeFields[field.name]); // Use name, not label
    
    
        // alert(JSON.stringify(fields, null, 2));
        // // alert(JSON.stringify(Object.keys(excludeFields)));
    
    
        const headers = fields.map(f => f.label);
    
        // const sampleRow = fields.reduce((acc, f) => {
        //   if (f.type === 'select' && f.options?.length) {
        //     acc[f.label] = f.options[0].label;
        //   } else if (f.type === 'date') {
        //     acc[f.label] = '2000-01-01';
        //   } else {
        //     acc[f.label] = '';
        //   }
        //   return acc;
        // }, {});
    
        const ws = XLSX.utils.json_to_sheet([], { header: headers });
    
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, file);
    
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, fileName);
      };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
    
        reader.onload = (evt) => {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
          const processedData = json.map(row => {
            const newRow = { ...row };
            if (newRow.dob && typeof newRow.dob === 'number') {
              const date = XLSX.SSF.parse_date_code(newRow.dob);
              if (date) {
                const yyyy = date.y;
                const mm = String(date.m).padStart(2, '0');
                const dd = String(date.d).padStart(2, '0');
                newRow.dob = `${yyyy}-${mm}-${dd}`;
              }
            }
            return newRow;
          });
    
    
          if (!processedData.length) {
            alert("No valid data found in the Excel file.");
          }
          setExcelData(processedData);
        };
    
        reader.readAsArrayBuffer(file);
      };
  return (
     <div className="col-md-3 col-12 box d-flex align-items-center justify-content-center">
                <div className="text-center py-4 w-100">
                  <AppImage category="png" name="xls" alt="Import Data" width={120} height={120} />

                  <div className="custom-file mt-3 col-md-8 col-12 mx-auto">
                    <input
                      type="file"
                      name="profile_photo"
                      className="form-control bg-white"
                      id="excelFile"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                    />

                  </div>

                  <small className="text-muted d-block mt-2">
                    * Import users using .xls or .xlsx file
                  </small>

                  {columns && columns.length > 0 && (
                    <button className="btn btn-xs btn-outline-secondary mt-3" onClick={exportUserSample}>
                      Download Sample Excel
                    </button>
                  )}
                </div>
              </div>
  )
}

export default ExcelUpload