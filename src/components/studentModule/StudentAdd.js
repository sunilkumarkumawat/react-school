import React, { useState, useContext, useEffect, useCallback } from "react";
import Input from "../common/Input";
import { AppContext } from "../../context/AppContext";
import { validateFields } from '../../utils/validation';
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../../redux/usersListSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchRoles } from "../../redux/rolesSlice"; // Import roles thunk
import { fetchBranches } from "../../redux/branchSlice";
import AppImage from "../../utils/AppImage";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AssignPermission from "../roleModule/AssignPermission";

const StudentAdd = ({ editData, onSuccess }) => {
   
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const { token } = useContext(AppContext);
    const API_URL = process.env.REACT_APP_BASE_URL || '';
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { students } = useSelector((state) => state.studentList);
    const roles = useSelector(state => state.roles.roles || []);
    const roleStatus = useSelector(state => state.roles.status);
    const branches = useSelector(state => state.branches.branches || []);
    const branchStatus = useSelector(state => state.branches.status);


    const idParam = searchParams.get("id");
    const studentFromList = idParam && !editData
        ? students.find((u) => String(u.id) === String(idParam))
        : null;

        //alert(JSON.stringify(studentFromList));

    const initialFormState = editData
        ? {
            ...editData,
            image: null,
            name: editData.name || `${editData.first_name || ""} ${editData.last_name || ""}`.trim(),
        }
        : studentFromList
            ? {
                ...studentFromList,
                image: null,
                name: studentFromList.name || `${studentFromList.first_name || ""} ${studentFromList.last_name || ""}`.trim(),
            }
            : {
                name: "",
                mobile: "",
                email: "",
                username: "",
                password: "",
                dob: "",
                gender: "",
                father_name: "",
                address: "",
                role_id: "",
                branch_id: "",
                image: null,
            };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

  // If editData or userFromList changes, update formData
    useEffect(() => {
        if (editData) {
            setFormData({
                ...editData,
                image: null,
                name: editData.name || `${editData.first_name || ""} ${editData.last_name || ""}`.trim(),
            });
        } else if (studentFromList) {
            setFormData({
                ...studentFromList,
                image: null,
                name: studentFromList.name || `${studentFromList.first_name || ""} ${studentFromList.last_name || ""}`.trim(),
            });
        }
    }, [editData, studentFromList]);

    useEffect(() => {
        if (idParam && !editData && students.length === 0) {
            dispatch(fetchUsersList({ API_URL, token }));
        }
        if (token && roleStatus === 'idle') {
            dispatch(fetchRoles({ API_URL, token }));
        }
        if (token && branchStatus === 'idle') {
            dispatch(fetchBranches({ API_URL, token }));
        }
    }, [idParam, editData, students.length, dispatch, API_URL, token]);

    const columns = [
        {
            category: 'basic_details',
            fields: [
                { label: 'Branch', name: 'branch_id', required: false, type: 'select', options: branches.map(b => ({ value: b.id, label: b.name })) },
                { label: 'Role', name: 'role_id', required: false, type: 'select', options: roles.map(r => ({ value: r.id, label: r.name })) },
                { label: 'Name', name: 'name', required: false },
                { label: 'Mobile', name: 'mobile', required: false, pattern: '^[0-9]{10}$' },
                { label: 'Email', name: 'email', type: 'email', required: false },

            ]
        },
        {
            category: 'additional_details',
            fields: [
                { label: 'DOB', name: 'dob', type: 'date', required: false },
                { label: 'Gender', name: 'gender', required: false, type: 'select', options: [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }] },
                { label: 'Category', name: 'category', type: 'select', required: false, options: [{value: 'OBC', label: 'OBC' }, {value: 'General', label: 'General'}, {value: 'SC', label: 'SC'}, {value: 'ST', label: 'ST'}] },
                { label: 'Address', name: 'address', required: false },
                { label: 'Photo', name: 'image', type: 'file' }
            ]
        },
        {
            category: 'guardian_details',
            fields: [
                { label: 'Father Name', name: 'father_name', type: 'text', required: false },
                { label: 'Mother Name', name: 'mother_name', type: 'text', required: false },
                { label: 'Guardian Name', name: 'guardian_name', type: 'text', required: false },
                { label: 'Relation with Guardian', name: 'guardian_relation', type: 'text', required: false },
                { label: 'Guardian Phone', name: 'guardian_phone', type: 'tel', required: false },
                { label: 'Guardian Email', name: 'guardian_email', type: 'email', required: false },
                { label: 'Address', name: 'guardian_address', type: 'textarea', required: false },
               
            ]
        }

    ];

    const exportUserSample = () => {
        const excludeFields = { branch_id: true, image: true, role_id: true, password: true, username: true, gender: true }
        const fields = columns
            .flatMap(group => group.fields)
            .filter(field => !excludeFields[field.name]);

        const headers = fields.map(f => f.name);
        const ws = XLSX.utils.json_to_sheet([], { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "StudentImport");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "student-import-sample.xlsx");
    };

    const [excelData, setExcelData] = useState([]);

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

    const validateStep = async (fields) => {
        const requiredFields = fields.filter(col => col.required).map(col => col.name);
        const validationErrors = await validateFields(requiredFields, formData, token);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleNext = async () => {
        const stepFields = columns[step - 1].fields;
        const isValid = await validateStep(stepFields);
        if (!isValid) return;

        setStep((prev) => prev + 1);
    };

    // Handle previous step
    const handlePrev = () => {
        setStep((prev) => prev - 1);
    };

    // Handle form submit (final step)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const stepFields = columns[step - 1]?.fields;
        if (stepFields && !validateStep(stepFields)) return;

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) form.append(key, value);
            });


            let url = `${API_URL}/student`;
            let method = "POST";
            if ((editData && editData.id) || (studentFromList && studentFromList.id)) {
                url = `${API_URL}/student/${editData?.id || studentFromList.id}`;
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
                alert("Error: " + (errorData.message || "Failed to save student"));
                return;
            }

            dispatch(fetchUsersList({ API_URL, token }));

            if (onSuccess) onSuccess();
            if (!(editData || studentFromList)) {
                if (window.confirm("Student saved successfully!\n\nDo you want to add another student?\nPress Cancel to go to View page.")) {
                    setFormData({
                        name: "",
                        mobile: "",
                        email: "",
                        username: "",
                        password: "",
                        dob: "",
                        gender: "",
                        father_name: "",
                        country_id: "",
                        state_id: "",
                        city_id: "",
                        address: "",
                        role_id: "",
                        branch_id: "",
                        image: null,
                    });
                    setStep(1);
                } else {
                    navigate("/studentView");
                }
            } else {
                alert("Student updated successfully!");
                navigate("/studentView");
            }
        } catch (err) {
            alert("Error saving student.");
        }
    };

    

    const allFields = columns.flatMap(group => group.fields);
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
                                value={formData[col.name]}
                                onChange={handleChange}
                            >
                                <option value="">Select {col.label}</option>
                                {col.options && col.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                        ) : (
                            <input
                                type={col.type || "text"}
                                className={`form-control${errors[col.name] ? " is-invalid" : ""}`}
                                id={col.name}
                                name={col.name}
                                placeholder={col.label}
                                value={col.type === "file" ? undefined : formData[col.name]}
                                onChange={handleChange}
                                pattern={col.pattern || undefined}
                                maxLength={col.name === "mobile" ? 10 : undefined}
                            />
                        )}
                        {errors[col.name] && (
                            <div className="invalid-feedback">{errors[col.name]}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const handleExcelSubmit = async (e) => {
        e.preventDefault();

        const excelUsers = [...excelData];
        const chunkSize = 10;
        const totalChunks = Math.ceil(excelUsers.length / chunkSize);

        try {
            for (let i = 0; i < totalChunks; i++) {
                const chunk = excelUsers.slice(i * chunkSize, (i + 1) * chunkSize);

                const form = new FormData();
                form.append('students', JSON.stringify(chunk));

                chunk.forEach((student, idx) => {
                    Object.entries(student).forEach(([key, value]) => {
                        if (value instanceof File) {
                            form.append(`file_${idx}_${key}`, value, value.name);
                        }
                    });
                });

                const response = await fetch(`${API_URL}/excelUpload/Student`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: form,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setErrors(errorData.errors || {});
                    alert("Error uploading students: " + (errorData.message || "Unknown error"));
                    return;
                }

                console.log(`✅ Batch ${i + 1} uploaded successfully.`);
            }

            dispatch(fetchUsersList({ API_URL, token }));
            alert("🎉 All students uploaded successfully!");
            navigate("/studentView");
        } catch (err) {
            console.error("❌ Upload failed:", err);
            alert("Unexpected error while uploading students.");
        }
    };

    const [sidebarMenuFromAPI, setSidebarMenuFromAPI] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [menuLoading, setMenuLoading] = useState(false);
    const [menuError, setMenuError] = useState(null);

    const fetchMenusWithPermissions = async (token, user_id, role_id) => {
        if (!token) return;
        setMenuLoading(true);
        setMenuError(null);

        try {
            const response = await fetch(`${API_URL}/menus/permissions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id, role_id }),
            });

            const data = await response.json();

            if (response.ok && data?.data) {
                setSidebarMenuFromAPI(data.data);
                setPermissions(data.permissions);
            } else {
                setMenuError(data?.message || "Failed to fetch menus");
                setSidebarMenuFromAPI([]);
                setPermissions([]);
            }
        } catch (error) {
            console.error("Menu Fetch Error:", error);
            setMenuError(error.message || "Unexpected error occurred");
            setSidebarMenuFromAPI([]);
            setPermissions([]);
        } finally {
            setMenuLoading(false);
        }
    };

    useEffect(() => {
        if (!formData?.id && !formData?.role_id) return;
        fetchMenusWithPermissions(token, formData?.id, formData?.role_id);
    }, [formData?.id, formData?.role_id]);


    return (
        <div className="">
            {/* Breadcrumb */}
            <div className="row">
                <div className="col-md-12 col-12 p-0">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item">{editData || studentFromList ? "Edit Student" : "Add Student"}</li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="card card-outline card-orange col-md-12 col-12 p-0">
                    <div className="card-header bg-primary d-flex justify-content-between">
                        <div className="card-title">
                            <h4>
                                <i className="fa fa-user-graduate"></i> &nbsp;{editData || studentFromList ? "Edit Student" : "Add Student"}
                            </h4>
                        </div>
                        <div className="card-tools">
                            <a href="/studentView" className="btn btn-primary btn-sm">
                                <i className="fa fa-eye"></i>
                                <span className="Display_none_mobile">View</span>
                            </a>
                        </div>
                    </div>

                    {/* Upload & Form Section */}
                    <div className="row">

                        {/* Excel Upload Section */}
                        {excelData.length === 0 && (
                            <div className="col-md-3 col-12 box d-flex align-items-center justify-content-center">
                                <div className="text-center py-4 w-100">
                                    <AppImage category="png" name="xls" alt="Import Students" width={120} height={120} />
                                    <div className="custom-file mt-3 col-md-8 col-12 mx-auto">
                                        <input
                                            type="file"
                                            name="student_excel"
                                            className="form-control bg-white"
                                            id="excelFile"
                                            accept=".xlsx, .xls"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                    <small className="text-muted d-block mt-2">
                                        * Import students using .xls or .xlsx file
                                    </small>
                                    {columns?.length > 0 && (
                                        <button className="btn btn-xs btn-outline-secondary mt-3" onClick={exportUserSample}>
                                            Download Sample Excel
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {!excelData.length > 0 && (
                            <div className="col-md-9 py-2">
                                {/* Wizard Steps */}
                                <div className="wizard-steps d-flex justify-content-between position-relative mb-3">
                                    {["Basic Details", "Additional Details", "Guardian Details"].map((label, index) => (
                                        <div className="wizard-step-indicator text-center flex-fill" key={index}>
                                            <div className={`circle step-circle${step === index + 1 ? " active" : ""}`}>{index + 1}</div>
                                            <small className="d-block">{label}</small>
                                        </div>
                                    ))}
                                    <div
                                        className="step-line position-absolute w-100"
                                        style={{
                                            top: "12px",
                                            left: "0",
                                            height: "2px",
                                            background: "#dee2e6",
                                            zIndex: 0,
                                        }}
                                    ></div>
                                </div>

                                <form id="createCommon" encType="multipart/form-data" onSubmit={handleSubmit}>
                                    <div className="card-body">
                                        <div className="bg-item border p-3 rounded">

                                            {/* Step 1: Personal Details */}
                                            {step === 1 && (
                                                <div id="step-1" className="wizard-step">
                                                    {renderFields(columns[0].fields)}
                                                </div>
                                            )}

                                            {/* Step 2: Academic Info */}
                                            {step === 2 && (
                                                <div id="step-2" className="wizard-step">
                                                    {renderFields(columns[1].fields)}
                                                </div>
                                            )}

                                            {/* Step 3: Parent Info */}
                                            {step === 3 && (
                                                <div id="step-3" className="wizard-step">
                                                    {renderFields(columns[2].fields)}
                                                </div>
                                            )}

                                            {/* Wizard Navigation Buttons */}
                                            <div className="d-flex justify-content-between mt-4">
                                                {step > 1 && (
                                                    <button type="button" className="btn btn-secondary" onClick={handlePrev}>
                                                        Previous
                                                    </button>
                                                )}
                                                {step < 3 && (
                                                    <button type="button" className="btn btn-primary ms-auto" onClick={handleNext}>
                                                        Next
                                                    </button>
                                                )}
                                                {step === 3 && (
                                                    <button type="submit" className="btn btn-success ms-auto">
                                                        {editData || studentFromList ? "Update" : "Submit"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}


                        {/* Excel Preview */}
                        {excelData.length > 0 && (
                            <div className={`p-3 ${excelData.length === 0 ? "col-md-9" : "col-md-12"}`}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Imported Student Data</h5>
                                    <button className="btn btn-sm btn-secondary" onClick={() => setExcelData([])}>
                                        ← Back to Form
                                    </button>
                                </div>

                                <table className="table table-bordered table-striped table-responsive">
                                    <thead className="table-primary">
                                        <tr>
                                            {allFields.map(field => (
                                                <th key={field.name}>{field.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {excelData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {allFields.map(field => (
                                                    <td key={`${rowIndex}-${field.name}`}>
                                                        {field.type === 'select' ? (
                                                            <select
                                                                value={row[field.name] || ''}
                                                                onChange={(e) => {
                                                                    const updated = [...excelData];
                                                                    updated[rowIndex][field.name] = e.target.value;
                                                                    setExcelData(updated);
                                                                }}
                                                                className="form-control"
                                                            >
                                                                <option value="">Select</option>
                                                                {field.options?.map(opt => (
                                                                    <option key={opt.value} value={opt.value}>
                                                                        {opt.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : field.type === 'date' ? (
                                                            <input
                                                                type="date"
                                                                value={row[field.name] || ''}
                                                                onChange={(e) => {
                                                                    const updated = [...excelData];
                                                                    updated[rowIndex][field.name] = e.target.value;
                                                                    setExcelData(updated);
                                                                }}
                                                                className="form-control"
                                                            />
                                                        ) : field.type === 'file' ? (
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
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={row[field.name] || ''}
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
                                                    Submit Imported Students
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


export default StudentAdd;