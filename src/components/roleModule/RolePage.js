import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { validateFields } from '../../utils/validation';
import Input from '../common/Input';
import { AppContext } from "../../context/AppContext";
import ActionButton from '../common/ActionButton';
import { fetchRoles } from '../../redux/rolesSlice'; // <-- Import thunk

const RolePage = () => {
  const { token } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || '';
  const dispatch = useDispatch();
  const roles = useSelector(state => state.roles.roles || []);
  const roleStatus = useSelector(state => state.roles.status);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
  });

  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch roles when user logs in or roles are not loaded
  useEffect(() => {
    if (token && roleStatus === 'idle') {
      dispatch(fetchRoles({ API_URL, token }));
    }
    // eslint-disable-next-line
  }, [token, API_URL, roleStatus, dispatch]);

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
      .filter(col => col.required)
      .map(col => col.name);

    const validationErrors = validateFields(requiredFields, formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const url = isEdit ? `${API_URL}/role/${formData.id}` : `${API_URL}/role`;
    const method = isEdit ? 'put' : 'post';

    try {
      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchRoles({ API_URL, token }));
      setFormData({
        id: '',
        name: '',
        description: '',
      });
      setIsEdit(false);
      setErrors({});
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEdit = (role) => {
    setFormData({
      id: role.id || '',
      name: role.name || '',
      description: role.description || '',
    });
    setIsEdit(true);
    setErrors({});
  };

  const handleDelete = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await axios.delete(`${API_URL}/api/roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchRoles({ API_URL, token }));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const columns = [
    { label: 'Role Name', name: 'name', required: true },
    { label: 'Description', name: 'description' }
  ];

  return (
   <div className="">
      <div className="row mb-1">
        <div className="col-12">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active">Role</li>
          </ul>
        </div>
      </div>

      <div className="row">
        {/* Role Form */}
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="fa fa-user-shield"></i> {isEdit ? 'Edit' : 'Add'} Role</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {columns.map((col) => (
                    <div className="col-sm-12" key={col.name}>
                      <Input
                        label={col.label}
                        name={col.name}
                        type={col.type || 'text'}
                        value={formData[col.name]}
                        onChange={handleChange}
                        required={col.required}
                        error={errors[col.name]}
                        pattern={col.pattern}
                      />
                    </div>
                  ))}
                  <div className="col-12 mt-2">
                    <ActionButton type="submit" className="btn btn-primary">
                      {isEdit ? 'Update' : 'Submit'}
                    </ActionButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Role List */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light">
              <h5><i className="fa fa-list"></i> Role List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="bg-light">
                    <tr>
                      <th>Sr. No</th>
                      <th>Role Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.length > 0 ? roles.map((role, index) => (
                      <tr key={role.id}>
                        <td>{index + 1}</td>
                        <td>{role.name}</td>
                        <td>{role.description}</td>
                        <td>
                          <ActionButton className="btn btn-sm btn-warning mr-1" onClick={() => handleEdit(role)}>
                            Edit
                          </ActionButton>
                          <ActionButton className="btn btn-sm btn-danger" onClick={() => handleDelete(role.id)}>
                            Delete
                          </ActionButton>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">No roles found.</td>
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

export default RolePage;





  