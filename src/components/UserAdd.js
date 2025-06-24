import React, { useState, useContext, useEffect, useCallback } from "react";
import Input from "./common/Input";
import { AppContext } from "../context/AppContext";
import { validateFields } from '../utils/validation';
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../redux/usersListSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchRoles } from "../redux/rolesSlice"; // Import roles thunk
import { fetchBranches } from "../redux/branchSlice";
import AppImage from "../utils/AppImage";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AssignPermission from "./roleModule/AssignPermission";

const UserAdd = ({ editData, onSuccess }) => {

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { token } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || '';
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { users } = useSelector((state) => state.usersList);
  const roles = useSelector(state => state.roles.roles || []);
  const roleStatus = useSelector(state => state.roles.status);
  const branches = useSelector(state => state.branches.branches || []);
  const branchStatus = useSelector(state => state.branches.status);
  const [finalPermission, setFinalPermission] = useState([]);
  // Find user by id from usersListSlice if id param exists and no editData
  const idParam = searchParams.get("id");
  const userFromList = idParam && !editData
    ? users.find((u) => String(u.id) === String(idParam))
    : null;

  // If editData or userFromList is present, use it as initial state, else use blank
  const initialFormState = editData
    ? {
      ...editData,
      image: null,
      name: editData.name || `${editData.first_name || ""} ${editData.last_name || ""}`.trim(),
    }
    : userFromList
      ? {
        ...userFromList,
        image: null,
        name: userFromList.name || `${userFromList.first_name || ""} ${userFromList.last_name || ""}`.trim(),
      }
      : {
        name: "",
        mobile: "",
        email: "",
        username: "",
        password: "",
        dob: "",
        gender_id: "",
        father_name: "",
        // country_id: "",
        // state_id: "",
        // city_id: "",
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
    } else if (userFromList) {
      setFormData({
        ...userFromList,
        image: null,
        name: userFromList.name || `${userFromList.first_name || ""} ${userFromList.last_name || ""}`.trim(),
      });
    }
    // eslint-disable-next-line
  }, [editData, userFromList]);

  // If id param exists and users are not loaded, fetch users
  useEffect(() => {
    if (idParam && !editData && users.length === 0) {
      dispatch(fetchUsersList({ API_URL, token }));
    }
    if (token && roleStatus === 'idle') {
      dispatch(fetchRoles({ API_URL, token }));
    }
    if (token && branchStatus === 'idle') {
      dispatch(fetchBranches({ API_URL, token }));
    }
  }, [idParam, editData, users.length, dispatch, API_URL, token]);


  // Columns for each step
  const columns = [
    {
      category: 'basic_details',
      fields: [
        { label: 'Branch', name: 'branch_id', required: false, type: 'select', options: branches.map(b => ({ value: b.id, label: b.name })) },
        { label: 'Role', name: 'role_id', required: false, type: 'select', options: roles.map(r => ({ value: r.id, label: r.name })) },
        { label: 'Name', name: 'name', required: false },
        { label: 'Mobile', name: 'mobile', required: false, pattern: '^[0-9]{10}$' },
        { label: 'Email', name: 'email', type: 'email', required: false },
        { label: 'Username', name: 'username', required: false },
        // { label: 'Password', name: 'password', type: 'password', required: !(editData || userFromList) },
        { label: 'Password', name: 'password', type: 'password', required: false },

      ]
    },
    {
      category: 'additional_details',
      fields: [
        { label: 'DOB', name: 'dob', type: 'date', required: false },
        { label: 'Gender', name: 'gender_id', required: false, type: 'select', options: [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }] },
        { label: 'Father Name', name: 'father_name', required: false },
        // { label: 'Country', name: 'country_id', required: true, type: 'select', options: [{ value: '1', label: 'India' }] },
        // { label: 'State', name: 'state_id', required: true, type: 'select', options: [{ value: '1', label: 'State1' }] },
        // { label: 'City', name: 'city_id', required: true, type: 'select', options: [{ value: '1', label: 'City1' }] },
        { label: 'Address', name: 'address', required: false },

        { label: 'Photo', name: 'image', type: 'file' }
      ]
    }
  ];


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
    XLSX.utils.book_append_sheet(wb, ws, "UserImport");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "user-import-sample.xlsx");
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

  // Validation for each step
  const validateStep = async (fields) => {
    const requiredFields = fields.filter(col => col.required).map(col => col.name);
    const validationErrors = await validateFields(requiredFields, formData, token);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle next step
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
      
      // const form = new FormData();
      // Object.entries(formData).forEach(([key, value]) => {
      //   let finalValue;
      //   if (value === null || value === undefined) {
      //     finalValue = "N/A"; // default value
      //   } else {
      //     finalValue = value;
      //   }
      //   console.log(`Appending ${key}:`, finalValue); // Debug log
      //   form.append(key, finalValue);
      // });



      form.append('permissions', JSON.stringify(finalPermission));
      
      let url = `${API_URL}/user`;
      let method = "POST";
      if ((editData && editData.id) || (userFromList && userFromList.id)) {
        url = `${API_URL}/user/${editData?.id || userFromList.id}`;
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
        alert("Error: " + (errorData.message || "Failed to save user"));
        return;
      }

      // Update users list in redux after add/update
      dispatch(fetchUsersList({ API_URL, token }));

      if (onSuccess) onSuccess();
      if (!(editData || userFromList)) {
        if (window.confirm("User saved successfully!\n\nDo you want to add another user?\nPress Cancel to go to View page.")) {
          setFormData({
            name: "",
            mobile: "",
            email: "",
            username: "",
            password: "",
            dob: "",
            gender_id: "",
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
          navigate("/userView");
        }
      } else {
        alert("User updated successfully!");
        navigate("/userView");
      }
    } catch (err) {
      alert("Error saving user.");
    }
  };

  const handlePermissionChange = useCallback((permissions) => {
    setFinalPermission(permissions);
  }, []);


    const allFields = columns.flatMap(group => group.fields); // includes type, label, name
    // Render fields for current step
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

    const excelUsers = [...excelData]; // Your array of users
    const chunkSize = 10;
    const totalChunks = Math.ceil(excelUsers.length / chunkSize);

    try {
      for (let i = 0; i < totalChunks; i++) {
        const chunk = excelUsers.slice(i * chunkSize, (i + 1) * chunkSize);

        const form = new FormData();

        // Attach chunk data as JSON string
        form.append('users', JSON.stringify(chunk));

        // If any file exists in chunk, attach them separately
        chunk.forEach((user, idx) => {
          Object.entries(user).forEach(([key, value]) => {
            if (value instanceof File) {
              form.append(`file_${idx}_${key}`, value, value.name);
            }
          });
        });

        const response = await fetch(`${API_URL}/excelUpload/User`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set 'Content-Type', let browser handle it
          },
          body: form,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrors(errorData.errors || {});
          alert("Error uploading users: " + (errorData.message || "Unknown error"));
          return;
        }

        console.log(`✅ Batch ${i + 1} uploaded successfully.`);
      }

      // Refresh user list after all uploads
      dispatch(fetchUsersList({ API_URL, token }));
      alert("🎉 All users uploaded successfully!");
      navigate("/userView");

    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Unexpected error while uploading users.");
    }
  };


  const [sidebarMenuFromAPI, setSidebarMenuFromAPI] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(null);

  const fetchMenusWithPermissions = async (token, user_id, role_id) => {
    // Do not proceed if essential data is missing
    if (!token) {
      console.warn("Missing token");
      return;
    }

    setMenuLoading(true);
    setMenuError(null); // reset previous error

    try {
      const response = await fetch(`${API_URL}/menus/permissions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          role_id,
        }),
      });

      const data = await response.json();

      if (response.ok && data?.data) {
        setSidebarMenuFromAPI(data.data);
        setPermissions(data.permissions);
      } else {
        setMenuError(data?.message || "Failed to fetch menus");
        setSidebarMenuFromAPI([]); // reset menu on failure
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
    // If both are missing, return early
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
            <li className="breadcrumb-item">{editData || userFromList ? "Edit User" : "UserAdd"}</li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="card card-outline card-orange col-md-12 col-12 p-0">
          <div className="card-header bg-primary d-flex justify-content-between">
            <div className="card-title">
              <h4>
                <i className="fa fa-desktop"></i> &nbsp;{editData || userFromList ? "Edit User" : "Add User"}
              </h4>
            </div>
            <div className="card-tools">
              <a href="/userView" className="btn btn-primary btn-sm">
                <i className="fa fa-eye"></i>
                <span className="Display_none_mobile">View</span>
              </a>
            </div>
          </div>

          {/* Profile Upload Section */}
          <div className="row">

            {excelData.length === 0 && (
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
            )}

            {/* Form Section */}

            {!excelData.length > 0 && (
              <div className="col-md-9 py-2" >
                {/* Wizard Steps */}
                <div className="wizard-steps d-flex justify-content-between position-relative mb-3">
                  <div className="wizard-step-indicator text-center flex-fill">
                    <div className={`circle step-circle${step === 1 ? " active" : ""}`}>1</div>
                    <small className="d-block">Basic Details</small>
                  </div>
                  <div className="wizard-step-indicator text-center flex-fill">
                    <div className={`circle step-circle${step === 2 ? " active" : ""}`}>2</div>
                    <small className="d-block">Additional Details</small>
                  </div>
                  <div className="wizard-step-indicator text-center flex-fill">
                    <div className={`circle step-circle${step === 3 ? " active" : ""}`}>3</div>
                    <small className="d-block">Permissions</small>
                  </div>
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
                      {/* Step 1: Basic Details */}
                      {step === 1 && (
                        <div id="step-1" className="wizard-step">
                          {/* <h5>
                          <i className="fa fa-user"></i> Basic Details
                        </h5> */}
                          {renderFields(columns[0].fields)}
                        </div>
                      )}

                      {/* Step 2: Additional Details */}
                      {step === 2 && (
                        <div id="step-2" className="wizard-step">
                          {/* <h5>
                          <i className="fa fa-info-circle"></i> Additional Details
                        </h5> */}
                          {renderFields(columns[1].fields)}
                        </div>
                      )}

                      {/* Step 3: Permissions */}
                      {step === 3 && (
                        <div id="step-3" className="wizard-step">
                          {/* <h5>
                          <i className="fa fa-lock"></i> Permissions
                        </h5> */}

                          <AssignPermission
                            sidebarMenu={sidebarMenuFromAPI}
                            roleId={1}
                            initialPermissions={permissions}
                            handlePermissionChange={handlePermissionChange}
                          />

                          {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
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
                            {editData || userFromList ? "Update" : "Submit"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>)}


            {/* excel upload Section */}
            {excelData.length > 0 && (
              <div className={`p-3 ${excelData.length === 0 ? "col-md-9" : "col-md-12"}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Imported User Data</h5>
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
                        {allFields.map((field, colIndex) => (
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
                                  updated[rowIndex][field.name] = file; // store the File object
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
                      <td colSpan={allFields.length} className="text-center" >
                        <button className="btn btn-sm btn-success" onClick={handleExcelSubmit}>
                          Submit Imported Users
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

          </div>
          {/* End of row */}
        </div>
      </div>
    </div>
  );
};

export default UserAdd;