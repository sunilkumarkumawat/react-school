import React, { useContext, useEffect, useState } from "react";
import ActionButton from "../common/ActionButton";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../context/AppContext";
import { fetchClasses } from "../../redux/classSlice";
import Select from "../common/Select";

const ExamAssign = ({ setShowModal }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [assignedClasses, setAssignedClasses] = useState([]);
  const { token } = useContext(AppContext);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_BASE_URL || "";
  const classes = useSelector((state) => state.classes.classes || []);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    class_id: "",
  });

  // const classOptions = ["Class 1", "Class 2", "Class 3", "Class 4"];

  const handleAssign = () => {
    if (selectedClass && !assignedClasses.includes(selectedClass)) {
      setAssignedClasses([...assignedClasses, selectedClass]);
      setSelectedClass("");
    }
  };

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

  useEffect(() => {
    if (token) {
      dispatch(fetchClasses({ API_URL, token }));
    }
  }, [token, API_URL, dispatch]);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="close-button">
          <button onClick={() => setShowModal(false)}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="row">
          {/* class form */}
          <div className="col-md-3">
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fa fa-user-shield"></i>Assign Class to Exam
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-12">
                    <Select
                      key="class_id"
                      label="Class"
                      name="class_id"
                      options={classes.map((classes) => ({
                        value: classes.id,
                        label: classes.class_name,
                      }))} // ✅ Should be an array of { label, value } objects
                      value={formData.class_id} // ✅ Correct key reference
                      onChange={handleChange}
                      required={true} // ✅ Boolean, not a string
                      error={errors.class_id}
                    />
                  </div>
                  <div className="col-12 mt-2">
                    <button onClick={handleAssign} className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* class list */}
          <div className="col-md-9">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fa fa-list"></i> Assigned Classes:
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="bg-light">
                      <tr>
                        <th>Sr. No</th>
                        <th>Class Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedClasses.length > 0 ? (
                        assignedClasses.map((classes, index) => (
                          <tr key={classes.id}>
                            <td>{index + 1}</td>
                            <td>{classes.cls}</td>
                            <td>
                              <ActionButton className="btn btn-sm btn-danger">
                                Delete
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
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 1140px;
          position: relative;
        }

        .close-button{
          position: absolute;
          top: -6%;
          right: -1%;
          z-index: 99;
        }
        .close-button button{
          width: 30px;
          height: 30px;
          border-radius: 30px;
          background: white;
        }

        select {
          margin: 10px;
        }

        table {
          width: 100%;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ExamAssign;
