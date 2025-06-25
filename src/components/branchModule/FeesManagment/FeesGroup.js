import React, { useContext, useState, useEffect } from "react";
import Input from "../../common/Input";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { validateFields } from "../../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeesGroups } from "../../../redux/feesGroupSlice";
import ActionButton from "../../common/ActionButton";

const FeesGroup = () => {
  const columns = [{ label: "Name", name: "name", required: true }];
  const { token, user } = useContext(AppContext);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_BASE_URL || "";
  const feesGroups = useSelector((state) => state.feesGroups.feesGroups || []);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchFeesGroups({ API_URL, token }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = columns
      .filter((col) => col.required)
      .map((col) => col.name);

    const validationErrors = validateFields(requiredFields, formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create updated formData with permissions
    const updatedFormData = {
      ...formData,
    };

    const url = isEdit
      ? `${API_URL}/feesGroup/${formData.id}`
      : `${API_URL}/feesGroup`;
    const method = isEdit ? "put" : "post";

    try {
      await axios[method](url, updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchFeesGroups({ API_URL, token }));
      setFormData({
        id: "",
        name: "",
      });
      setIsEdit(false);
      setErrors({});
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };
  const handleEdit = (role) => {
    setFormData({
      id: role.id || "",
      name: role.name || "",
    });
    setIsEdit(true);
    setErrors({});
  };
  const handleDelete = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this Fees Group?"))
      return;
    try {
      await axios.delete(`${API_URL}/deleteFeesGroup/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchFeesGroups({ API_URL, token }));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };
  return (
    <>
      <div className="row mb-1">
        <div className="col-12">
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard">Dashboard</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        {/* Role Form */}
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fa fa-user-shield"></i> {isEdit ? "Edit" : "Add"}{" "}
                Fees Group
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
        <div className="col-md-9">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fa fa-list"></i> Fees Group List
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
                    {feesGroups.length > 0 ? (
                      feesGroups.map((fees, index) => (
                        <tr key={fees.id}>
                          <td>{index + 1}</td>
                          <td>{fees.name}</td>
                          <td>
                            <ActionButton
                              className="btn btn-sm btn-warning mr-1"
                              onClick={() => handleEdit(fees)}
                            >
                              Edit
                            </ActionButton>
                            <ActionButton
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(fees.id)}
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
    </>
  );
};

export default FeesGroup;
