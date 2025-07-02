import React, { useContext, useEffect, useState } from "react";
import ActionButton from "../common/ActionButton";
import { useDispatch, useSelector } from "react-redux";
import Input from "../common/Input";
import Select from "../common/Select";
import { fetchFeesGroups } from "../../redux/feesGroupSlice";
import { validateFields } from "../../utils/validation";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { fetchFeesTypes } from "../../redux/feesTypeSlice";

const FeesType = () => {
  const feesGroups = useSelector((state) => state.feesGroups.feesGroups || []);
  const feesTypes = useSelector((state) => state.feesTypes.feesTypes || []);
  const { token, user } = useContext(AppContext);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_BASE_URL || "";
  const [formData, setFormData] = useState({
    id: "",
    fees_group_id: "",
    name: "",
  });
  useEffect(() => {
    if (token) {
      dispatch(fetchFeesTypes({ API_URL, token }));
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

  const columns = [
    {
      label: "Fees Group",
      name: "fees_group_id",
      required: true,
      type: "select",
      options: feesGroups.map((group) => ({
        value: group.id,
        label: group.name,
      })),
    },
    { label: "Name", name: "name", required: true },
  ];

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
    const url = isEdit
      ? `${API_URL}/feesType/${formData.id}`
      : `${API_URL}/feesType`;
    const method = isEdit ? "put" : "post";
    try {
      await axios[method](url, updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchFeesTypes({ API_URL, token }));
      setFormData({
        id: "",
        name: "",
        fees_group_id: "",
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
      fees_group_id: role.fees_group_id || "",
    });
    setIsEdit(true);
    setErrors({});
  };
  const handleDelete = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this Fees Group?"))
      return;
    try {
      await axios.delete(`${API_URL}/deleteFeesType/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchFeesTypes({ API_URL, token }));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div>
      {/* fees type form */}
      <div className="row">
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fa fa-user-shield"></i> Add Fees Type
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {columns.map((col) =>
                    col.type === "select" ? (
                      <div className="col-sm-12" key={col.name}>
                        <Select
                          key={col.name}
                          label={col.label}
                          name={col.name}
                          options={col.options}
                          value={formData[col.name]}
                          onChange={handleChange}
                          required={col.required}
                          error={errors[col.name]}
                        />
                      </div>
                    ) : (
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
                    )
                  )}

                  <div className="col-12 mt-2">
                    <button type="submit" className="btn btn-primary">
                      {/* {isEdit ? "Update" : "Submit"} */}Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-9 col-12">
          <div className="card card-orange card-outline">
            <div className="card-header bg-light">
              <div className="card-title">
                <h4>
                  <i className="fa fa-list"></i> Fees Type List
                </h4>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead className="bg-light">
                    <tr>
                      <th>Sr No</th>
                      <th>Fees Type</th>
                      <th>Fees Group</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feesTypes.length > 0 ? (
                      feesTypes.map((fees, index) => (
                        <tr key={fees.id}>
                          <td>{index + 1}</td>
                          <td>{fees.fees_groups_name}</td>
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
    </div>
  );
};

export default FeesType;
