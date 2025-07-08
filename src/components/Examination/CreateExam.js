import React, { useContext, useEffect, useState } from "react";
import Input from "../common/Input";
import ActionButton from "../common/ActionButton";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../context/AppContext";
import { fetchClasses } from "../../redux/classSlice";
import axios from "axios";
import { validateFields } from "../../utils/validation";
import ExamAssign from "./ExamAssign";

const CreateExam = () => {
   const columns = [{ label: "Exam Name", name: "exam_name", required: true },{ label: "Description", name: "description", required: true }];

   const { token, user } = useContext(AppContext);
    const dispatch = useDispatch();
    const API_URL = process.env.REACT_APP_BASE_URL || "";
    const classes = useSelector((state) => state.classes.classes || []);
    const [formData, setFormData] = useState({
      id: "",
      class_name: "",
      section_name: "",
    });
  
    useEffect(() => {
      if (token) {
        dispatch(fetchClasses({ API_URL, token }));
      }
      // eslint-disable-next-line
    }, [token, API_URL, dispatch]);
  
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
    
    const handleSubmit = async (e) => {
      e.preventDefault();
  
       if (!await validateStep(columns)) return;
  
  
      // Create updated formData with permissions
      const updatedFormData = {
        ...formData,
      };
  
      const url = isEdit
        ? `${API_URL}/class/${formData.id}`
        : `${API_URL}/class`;
      const method = isEdit ? "put" : "post";
  
      try {
        await axios[method](url, updatedFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchClasses({ API_URL, token }));
        setFormData({
          id: "",
          class_name: "",
          section_name: "",
        });
        setIsEdit(false);
        setErrors({});
      } catch (error) {
        console.error("Error saving role:", error);
      }
    };
    const handleEdit = (classes) => {
      setFormData({
        id: classes.id || "",
        class_name: classes.class_name || "",
        section_name: classes.section_name || "",
      });
      setIsEdit(true);
      setErrors({});
    };
    const handleDelete = async (classId) => {
      if (!window.confirm("Are you sure you want to delete this Class?"))
        return;
      try {
        await axios.delete(`${API_URL}/deleteClass/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchClasses({ API_URL, token }));
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    };

    const handleModal = () =>{
        alert("Exam Assign to Class Modal");
    }
const [showModal, setShowModal] = useState(false);
  return (
    <div className="">
      <div className="row">
        {/* class form */}
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fa fa-user-shield"></i> {isEdit ? "Edit" : "Add"}{" "}
                Exam
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {columns.map((col) => (
                    <div className="col-sm-12" key={col.name}>
                      <Input
                        label={col.label}
                        name={col.name}
                        type={col.type || "text"}
                        value={formData[col.name]}
                        onChange={handleChange}
                        required={col.required}
                        error={errors[col.name]}
                        pattern={col.pattern}
                      />
                    </div>
                  ))}
                  <div className="col-12 mt-2">
                    <button type="submit" className="btn btn-primary">
                      {isEdit ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* class list */}
        <div className="col-md-9">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fa fa-list"></i> Exam List
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="bg-light">
                    <tr>
                      <th>Sr. No</th>
                      <th>Exam Name</th>
                      <th>Exam Assign Class</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.length > 0 ? (
                      classes.map((classes, index) => (
                        <tr key={classes.id}>
                          <td>{index + 1}</td>
                          <td>{classes.class_name}</td>
                          <td>{classes.section_name}</td>
                          <td>
                            <ActionButton
                              className="btn btn-sm btn-warning mr-1"
                              onClick={() => handleEdit(classes)}
                            >
                              Edit
                            </ActionButton>
                            <ActionButton
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(classes.id)}
                            >
                              Delete
                            </ActionButton>
                            <ActionButton
                              className="btn btn-sm btn-success"
                              onClick={() => setShowModal(true)}
                            >
                              add_moderator
                            </ActionButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No classes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
         {showModal && (
          <ExamAssign setShowModal={setShowModal} />
         )}
    </div>
  );
};


export default CreateExam