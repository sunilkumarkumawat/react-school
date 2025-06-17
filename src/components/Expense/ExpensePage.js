import React, { useState, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext"; // Assuming AppContext provides token and API_URL
import { validateFields } from "../../utils/validation"; // Assuming validation utility
// import Input from "./common/Input"; // Assuming reusable Input component
import AppImage from "../../utils/AppImage"; // Assuming image utility
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchExpensesList } from "../../redux/expensesSlice"; // Assuming expenses slice for Redux
import { fetchPaymentModes } from "../../redux/paymentModesSlice"; // Assuming payment modes slice

const ExpenseAdd = ({ editData, onSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { token } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || "";
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { expenses } = useSelector((state) => state.expenses || {});
  const paymentModes = useSelector((state) => state.paymentModes?.paymentModes || []);
  const paymentModeStatus = useSelector((state) => state.paymentModes?.status || "idle");

  // Find expense by id from expensesSlice if id param exists and no editData
  const idParam = searchParams.get("id");
  const expenseFromList = idParam && !editData
    ? expenses.find((e) => String(e.id) === String(idParam))
    : null;

  // Initial form state based on editData, expenseFromList, or default
  const initialFormState = editData
    ? { ...editData, Attachment: null }
    : expenseFromList
      ? { ...expenseFromList, Attachment: null }
      : {
          name: "",
          qty: "",
          rate: "",
          payment_mode_id: "",
          Attachment: null,
          description: "",
        };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [excelData, setExcelData] = useState([]);

  // Update formData if editData or expenseFromList changes
  useEffect(() => {
    if (editData) {
      setFormData({ ...editData, Attachment: null });
    } else if (expenseFromList) {
      setFormData({ ...expenseFromList, Attachment: null });
    }
  }, [editData, expenseFromList]);

  // Fetch expenses and payment modes if needed
  useEffect(() => {
    if (idParam && !editData && expenses?.length === 0) {
      dispatch(fetchExpensesList({ API_URL, token }));
    }
    if (token && paymentModeStatus === "idle") {
      dispatch(fetchPaymentModes({ API_URL, token }));
    }
  }, [idParam, editData, expenses?.length, dispatch, API_URL, token, paymentModeStatus]);

  // Define columns for the form
  const columns = useMemo(
    () => [
      {
        category: "expense_details",
        fields: [
          { label: "Expense Head", name: "name", required: true },
          { label: "Quantity", name: "qty", required: true, type: "number" },
          { label: "Rate", name: "rate", required: true, type: "number" },
          {
            label: "Payment Mode",
            name: "payment_mode_id",
            type: "select",
            required: true,
            options: paymentModes.map((pm) => ({ value: pm.id, label: pm.name })),
          },
          { label: "Attachment", name: "Attachment", type: "file" },
          { label: "Description", name: "description", type: "textarea", required: true },
        ],
      },
    ],
    [paymentModes]
  );

  // Export sample Excel template
  const exportExpenseSample = () => {
    const excludeFields = { Attachment: true, payment_mode_id: true };
    const fields = columns[0].fields.filter((field) => !excludeFields[field.name]);
    const headers = fields.map((f) => f.label);

    const ws = XLSX.utils.json_to_sheet([], { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExpenseImport");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "expense-import-sample.xlsx");
  };

  // Handle Excel file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (!json.length) {
        alert("No valid data found in the Excel file.");
      }
      setExcelData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  // Validate form fields
  const validateStep = async (fields) => {
    const requiredFields = fields.filter((col) => col.required).map((col) => col.name);
    const validationErrors = await validateFields(requiredFields, formData, token);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepFields = columns[0].fields;
    const isValid = await validateStep(stepFields);
    if (!isValid) return;

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) form.append(key, value);
      });

      let url = `${API_URL}/expense`;
      let method = "POST";
      if ((editData && editData.id) || (expenseFromList && expenseFromList.id)) {
        url = `${API_URL}/expense/${editData?.id || expenseFromList.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        alert("Error: " + (errorData.message || "Failed to save expense"));
        return;
      }

      dispatch(fetchExpensesList({ API_URL, token }));
      if (onSuccess) onSuccess();

      if (!(editData || expenseFromList)) {
        if (
          window.confirm(
            "Expense saved successfully!\n\nDo you want to add another expense?\nPress Cancel to go to View page."
          )
        ) {
          setFormData({
            name: "",
            qty: "",
            rate: "",
            payment_mode_id: "",
            Attachment: null,
            description: "",
          });
          setStep(1);
        } else {
          navigate("/expenseView");
        }
      } else {
        alert("Expense updated successfully!");
        navigate("/expenseView");
      }
    } catch (err) {
      alert("Error saving expense.");
    }
  };

  // Handle Excel submission
  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    const chunkSize = 10;
    const totalChunks = Math.ceil(excelData.length / chunkSize);

    try {
      for (let i = 0; i < totalChunks; i++) {
        const chunk = excelData.slice(i * chunkSize, (i + 1) * chunkSize);
        const form = new FormData();
        form.append("expenses", JSON.stringify(chunk));

        chunk.forEach((expense, idx) => {
          Object.entries(expense).forEach(([key, value]) => {
            if (value instanceof File) {
              form.append(`file_${idx}_${key}`, value, value.name);
            }
          });
        });

        const response = await fetch(`${API_URL}/excelUpload/Expense`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrors(errorData.errors || {});
          alert("Error uploading expenses: " + (errorData.message || "Unknown error"));
          return;
        }
      }

      dispatch(fetchExpensesList({ API_URL, token }));
      alert("All expenses uploaded successfully!");
      navigate("/expenseView");
    } catch (err) {
      alert("Unexpected error while uploading expenses.");
    }
  };

  // Render form fields
  const renderFields = (fields) => (
    <div className="row">
      {fields.map((col) => (
        <div className="col-md-4 col-12" key={col.name}>
          <div className="form-group">
            <label htmlFor={col.name}>
              {col.label} {col.required && <span className="text-danger">*</span>}
            </label>
            {col.type === "select" ? (
              <select
                className={`form-control${errors[col.name] ? " is-invalid" : ""}`}
                id={col.name}
                name={col.name}
                value={formData[col.name] || ""}
                onChange={handleChange}
              >
                <option value="">Select {col.label}</option>
                {col.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : col.type === "file" ? (
              <input
                type="file"
                className={`form-control${errors[col.name] ? " is-invalid" : ""}`}
                id={col.name}
                name={col.name}
                onChange={handleChange}
              />
            ) : col.type === "textarea" ? (
              <textarea
                className={`form-control${errors[col.name] ? " is-invalid" : ""}`}
                id={col.name}
                name={col.name}
                placeholder={col.label}
                value={formData[col.name] || ""}
                onChange={handleChange}
              />
            ) : (
              <input
                type={col.type || "text"}
                className={`form-control${errors[col.name] ? " is-invalid" : ""}`}
                id={col.name}
                name={col.name}
                placeholder={col.label}
                value={formData[col.name] || ""}
                onChange={handleChange}
              />
            )}
            {errors[col.name] && <div className="invalid-feedback">{errors[col.name]}</div>}
          </div>
        </div>
      ))}
    </div>
  );

  const allFields = columns[0].fields;

  return (
    <div className="">
      {/* Breadcrumb */}
      <div className="row">
        <div className="col-md-12 col-12 p-0">
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard">Dashboard</a>
            </li>
            <li className="breadcrumb-item">{editData || expenseFromList ? "Edit Expense" : "Add Expense"}</li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="card card-outline card-orange col-md-12 col-12 p-0">
          <div className="card-header bg-primary d-flex justify-content-between">
            <div className="card-title">
              <h4>
                <i className="fa fa-desktop"></i> {editData || expenseFromList ? "Edit Expense" : "Add Expense"}
              </h4>
            </div>
            <div className="card-tools">
              <a href="/expenseView" className="btn btn-primary btn-sm">
                <i className="fa fa-eye"></i>
                <span className="Display_none_mobile">View</span>
              </a>
            </div>
          </div>

          <div className="row">
            {excelData.length === 0 && (
              <div className="col-md-3 col-12 box d-flex align-items-center justify-content-center">
                <div className="text-center py-4 w-100">
                  <AppImage category="png" name="xls" alt="Import Data" width={120} height={120} />
                  <div className="custom-file mt-3 col-md-8 col-12 mx-auto">
                    <input
                      type="file"
                      name="excel_file"
                      className="form-control bg-white"
                      id="excelFile"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <small className="text-muted d-block mt-2">* Import expenses using .xls or .xlsx file</small>
                  {columns && columns.length > 0 && (
                    <button className="btn btn-xs btn-outline-secondary mt-3" onClick={exportExpenseSample}>
                      Download Sample Excel
                    </button>
                  )}
                </div>
              </div>
            )}

            {!excelData.length > 0 && (
              <div className="col-md-9 py-2">
                <form id="createExpense" encType="multipart/form-data" onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="bg-item border p-3 rounded">
                      <div id="step-1" className="wizard-step">
                        {renderFields(columns[0].fields)}
                      </div>
                      <div className="d-flex justify-content-between mt-4">
                        <button type="submit" className="btn btn-success ms-auto">
                          {editData || expenseFromList ? "Update" : "Submit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {excelData.length > 0 && (
              <div className="p-3 col-md-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Imported Expense Data</h5>
                  <button className="btn btn-sm btn-secondary" onClick={() => setExcelData([])}>
                    ← Back to Form
                  </button>
                </div>
                <table className="table table-bordered table-striped table-responsive">
                  <thead className="table-primary">
                    <tr>
                      {allFields.map((field) => (
                        <th key={field.name}>{field.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {allFields.map((field) => (
                          <td key={`${rowIndex}-${field.name}`}>
                            {field.type === "select" ? (
                              <select
                                value={row[field.name] || ""}
                                onChange={(e) => {
                                  const updated = [...excelData];
                                  updated[rowIndex][field.name] = e.target.value;
                                  setExcelData(updated);
                                }}
                                className="form-control"
                              >
                                <option value="">Select</option>
                                {field.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === "file" ? (
                              <input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  const updated = [...excelData];
                                  updated[rowIndex][field.name] = file;
                                  setExcelData(updated);
                                }}
                                className="form-control"
                              />
                            ) : field.type === "textarea" ? (
                              <textarea
                                value={row[field.name] || ""}
                                onChange={(e) => {
                                  const updated = [...excelData];
                                  updated[rowIndex][field.name] = e.target.value;
                                  setExcelData(updated);
                                }}
                                className="form-control"
                              />
                            ) : (
                              <input
                                type={field.type || "text"}
                                value={row[field.name] || ""}
                                onChange={(e) => {
                                  const updated = [...excelData];
                                  updated[rowIndex][field.name] = e.target.value;
                                  setExcelData(updated);
                                }}
                                className="form-control"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={allFields.length} className="text-center">
                        <button className="btn btn-sm btn-success" onClick={handleExcelSubmit}>
                          Submit Imported Expenses
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAdd;