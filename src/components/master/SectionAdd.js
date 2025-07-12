import React, { useContext, useEffect, useState } from "react";
import Input from "../common/Input";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { validateFields } from "../../utils/validation";
import { fetchSections } from "../../redux/sectionSlice";
import ActionButton from "../common/ActionButton";

const SectionAdd = ({ setShowModal }) => {
  const columns = [{ label: "Section", name: "name", required: true }];
  const sections = useSelector((state) => state.sections.sections || []);
  const { token } = useContext(AppContext);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_BASE_URL || "";
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });
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
    const requiredFields = fields
      .filter((col) => col.required)
      .map((col) => col.name);
    const validationErrors = await validateFields(
      requiredFields,
      formData,
      token
    );
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await validateStep(columns))) return;

    // Create updated formData with permissions
    const updatedFormData = {
      ...formData,
    };

    try {
      await axios.post(`${API_URL}/section`, updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchSections({ API_URL, token }));
      setFormData({
        id: "",
        name: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error saving section:", error);
    }
  };

  const handleDelete = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this Section?"))
      return;
    try {
      await axios.delete(`${API_URL}/deleteSection/${sectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchSections({ API_URL, token }));
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchSections({ API_URL, token }));
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
                  <i className="fa fa-user-shield"></i> Add Section
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
                      <button className="btn btn-primary">Submit</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fa fa-list"></i> Section List
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="bg-light">
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sections.length > 0 ? (
                        sections.map((section, index) => (
                          <tr key={section.id}>
                            <td>{index + 1}</td>
                            <td>{section.name}</td>
                            <td>
                              <ActionButton
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(section.id)}
                              >
                                Delete
                              </ActionButton>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No fees group found.
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
          top: -3%;
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

export default SectionAdd;
