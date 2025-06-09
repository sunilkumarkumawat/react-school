import React, { useContext, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';

const ExcelUploader = ({handleGetExcelData}) => {
  const [excelData, setExcelData] = useState([]);
  const { loggedIN } = useContext(AppContext);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // Convert to array of objects
      setExcelData(jsonData);
      handleGetExcelData(jsonData)
      console.log("Extracted Excel Data:", jsonData);
    };

    reader.readAsBinaryString(file);
  };

  const handleSaveToDB = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/saveExcelData`, {
        data: excelData,
      });
  
      if (response.data.status) {
        const access_token = response.data.access_token;
        const userData = response.data.user;
  
        loggedIN(access_token, userData);
        navigate("/dashboard");
      } else {
        if (response.data.errors && Array.isArray(response.data.errors)) {
          // Format and show duplicate entry errors
          const errorMessages = response.data.errors.map((item) => {
            const errorList = item.errors.join('\n');
            return `Row ${item.row} (${item.name}):\n${errorList}`;
          }).join('\n\n');
  
          alert(`Duplicate data found:\n\n${errorMessages}`);
        } else {
          alert(response.data.message || "Failed to save data.");
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response && error.response.data) {
        const res = error.response.data;
        if (res.errors && Array.isArray(res.errors)) {
          const errorMessages = res.errors.map((item) => {
            const errorList = item.errors.join('\n');
            return `Row ${item.row} (${item.name}):\n${errorList}`;
          }).join('\n\n');
  
          alert(`Duplicate data found:\n\n${errorMessages}`);
        } else {
          alert(res.message || "An error occurred while saving.");
        }
      } else {
        alert("A network error occurred.");
      }
    }
  };
  

  return (
    <div className="p-4 border rounded">
      <h4>📄 Upload Excel File</h4>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control my-3" />

      {excelData.length > 0 && (
        <>
          <button className="btn btn-success" onClick={handleSaveToDB}>
            Save to Database
          </button>

        
        </>
      )}
    </div>
  );
};

export default ExcelUploader;
