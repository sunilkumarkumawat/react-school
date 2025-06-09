import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import DynamicForm from "./DynamicForm";
import { AppContext } from '../context/AppContext';
const RoleForm = ({ roleName, role, handleDispatch, token, user, roleId = null, branchId = null ,closeModal,editData=[]}) => {

  const { showToastr } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL;

  const [data, setData] = useState({
    states: [],
    cities: [],
    roles: [],
  });




 
  const [responseTempId, setResponseTempId] = useState('');
  const [isSelecteFields, setIsSelecteFields] = useState(false);
  const [inputList, setInputList] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statesRes, rolesRes] = await Promise.all([
          axios.get(`${API_URL}/states`),
          role, // assumed to be a promise
        ]);

        const rolesArray = Object.entries(rolesRes).map(([id, name]) => ({
          id,
          name,
        }));

        setData((prev) => ({
          ...prev,
          states: statesRes.data,
          roles: rolesArray,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [roleName, role, branchId]);

  useEffect(() => {
    let initialData = {};

    fields.forEach((field) => {
      if (field.value !== undefined) {
     
        initialData[field.name] = field.value;
      }
    });
    setFormData(initialData);
  }, [roleName, role, branchId]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e, route) => {
    e.preventDefault();


    if (validateForm() || route === 'roleInputAssignment') {
      try {
        const response = await axios.post(`${API_URL}/${route}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status) {
          if (["Role", "Branch"].includes(roleName)) {
            handleDispatch();
          }
  
          if (route === 'createRole') {
            setIsSelecteFields(true);
            setResponseTempId(response.data?.data?.id);
            setInputList(response.data?.inputList);
          }
          if (route === 'roleInputAssignment') {
            closeModal()
          }
  
          showToastr(`${response.data.message}`, {
            position: ['roleInputAssignment','createRole'].includes(route) ? 'bottom-left' : 'center',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error.response?.data || error.message);
        showToastr("Error submitting form", {
          position: 'bottom-left',
          duration: 3000,
        });
      }
    }
  };
  // const commonFields = [
  //   { name: "admin_id", label: "Admin Id", type: "hidden", value: user?.admin_id },
  //   { name: "role_id", label: "Role Id", type: "hidden", value: roleId },
  //   { name: "branch_id", label: "Branch Id", type: "hidden", value: branchId },
  

  const roleFields = {
    Role: [
      { name: "admin_id", label: "Admin Id", type: "hidden", value: user?.admin_id },
      { name: "branch_id", label: "Branch Id", type: "hidden", value: branchId },
      { name: "name", label: "Role Name", type: "text", required: true, col: "12" },
      { name: "description", label: "Description", type: "textarea", col: "12" },
    ],
    Branch: [
      { name: "admin_id", label: "Admin Id", type: "hidden", value: user?.id },
      { name: "name", label: "Branch Name", type: "text", col: "12" },
      { name: "code", label: "Branch Code", type: "text", col: "6" },
      { name: "mobile", label: "Mobile No.", type: "tel", col: "6" }, 
      { name: "email", label: "Email", type: "email", col: "12" },
      { name: "address", label: "Address", type: "text", col: "12" },
    ],
   
  };

  

  const [optionsList,setOptionsList] = useState({});

 const [fields,setFields] = useState(roleName === "Role" || roleName === "Branch"
     ? roleFields[roleName]
     : []);
 
     const [loading, setLoading] = useState(false);
     const fetchAssignedInputs = async () => {
      try {
        setLoading(true); // Start loading
    
        const res = await axios.post(`${API_URL}/getRoleInputAssignments`, {
          role_id: roleId,
          admin_id: user?.admin_id,
          branch_id: branchId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (res.data.status) {
          const assignedInputIds = res.data.data;
    
          // Wait 1 second before applying
          await new Promise(resolve => setTimeout(resolve, 100));
        
        
          if (assignedInputIds !== null && typeof assignedInputIds === "object") {
         setFields(assignedInputIds);

       

          }

          const updatedFormData = assignedInputIds.reduce((acc, field) => {
            if (field.name === 'admin_id' || field.name === 'branch_id' || field.name === 'role_id') {
              // Use eval() to evaluate the field value, with a default of an empty string if not present
              acc[field.name] = eval(field.value || "");
            
            } else if (field.type === 'select') {
              // If field.options is a string, convert it to an array
              if (typeof field.options === 'string') {
                const options = field.options.split(',').map(option => option.trim());
                
                // Update the options list for this specific select field
                setOptionsList(prev => ({
                  ...prev,
                  [field.name]: options,
                }));
                
                acc[field.name] = '';
              } else if (Array.isArray(field.options)) {
                // If field.options is already an array, use it as is
                setOptionsList(prev => ({
                  ...prev,
                  [field.name]: field.options,
                }));
                
                acc[field.name] = '';
              } else {
                acc[field.name] = ""; // If neither string nor array, set it to empty string
              }
            } else {
              // For other fields, use their value or default to an empty string
              acc[field.name] = field.value || "";
            }
            return acc;
          }, {});
        
          setFormData(updatedFormData);


          
        }
      } catch (err) {
        console.error("Error fetching assigned inputs", err.response?.data || err.message);
      } finally {
        setLoading(false); // End loading
      }
    };



  useEffect(() => {
    if ((roleName !== "Role" || roleName !== "Branch")) {
      fetchAssignedInputs();
    }
  }, [roleName,branchId]);

  // const fields = roleName === "Role" || roleName === "Branch"
  //   ? roleFields[roleName]
  //   : [...commonFields, ...(roleFields[roleName] || [])];

    const [selectedIds, setSelectedIds] = useState([1,2,3,4,6,7]);
    
    const handleCheckboxChange = (id) => {
      if ([1, 2, 3].includes(id)) return; // prevent changes to fixed ids
      const updatedIds = selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id];
      setSelectedIds(updatedIds);
      // Update FormData
      const newFormData = new FormData();
      newFormData.append("selected_ids", JSON.stringify(updatedIds));
      newFormData.append("role_id", responseTempId);
      newFormData.append("admin_id", user?.admin_id);
      newFormData.append("branch_id", branchId);
      setFormData(newFormData);

      
    };

 useEffect(() => {
  if (editData && Object.keys(editData).length > 0) {
    setFormData((prev) => {
      // Only update if data actually changed
      const isDifferent = JSON.stringify(prev) !== JSON.stringify(editData);
      return isDifferent ? { ...editData } : prev;
    });
  }
}, [editData]);
  return (

    !isSelecteFields  ?
    
    <DynamicForm
    roleName={roleName}
    optionsList={optionsList}
    roleId={roleId}
    fields={fields}
    formData={formData}
    errors={errors}
    branchId={branchId}
    handleChange={handleChange}
    handleSubmit={handleSubmit}

  />
      : 
      ( <div className="card shadow-sm border-1">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Assign Inputs</h5>
        </div>
        <div className="card-body">
          <form onSubmit={(e) => handleSubmit(e, `roleInputAssignment`)}>
            <div className="row">

      
              {inputList.map((input) => (
                <div className="col-md-6" key={input.id}>
                <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`input-${input.id}`}
                  onChange={() => handleCheckboxChange(input.id)}
                  checked={selectedIds.includes(input.id)}
                  disabled={[1, 2, 3].includes(input.id)} // disable for ids 1, 2, 3
                />
                <label className="form-check-label" htmlFor={`input-${input.id}`}>
                  {input.label}
                </label>
              </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="col-12 mt-4 text-end">
            <button type="submit" className="btn btn-sm btn-success px-4">
              Submit
            </button>
          </div>
          </form>
      
        </div>
      </div>
      
      )
  );
};

export default RoleForm;
