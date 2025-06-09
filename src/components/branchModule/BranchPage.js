import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateFields } from '../../utils/validation';
import Input from '../common/Input';
import { AppContext } from "../../context/AppContext";
import ActionButton from '../common/ActionButton';
import { fetchBranches } from '../../redux/branchSlice'; // <-- Import thunk

const BranchPage = () => {
  const { token } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || '';
  const dispatch = useDispatch();
  const branches = useSelector(state => state.branches.branches || []);
  const branchStatus = useSelector(state => state.branches.status);

  const initialFormState = {
    id: '',
    code: '',
    name: '',
    contact_person: '',
    mobile: '',
    email: '',
    address: '',
    pin_code: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch branches when user logs in or branches are not loaded
  useEffect(() => {
    if (token && branchStatus === 'idle') {
      dispatch(fetchBranches({ API_URL, token }));
    }
    // eslint-disable-next-line
  }, [token, API_URL, branchStatus, dispatch]);

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

    const url = isEdit ? `${API_URL}/branch/${formData.id}` : `${API_URL}/branch`;
    const method = isEdit ? 'put' : 'post';

    try {
      await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      dispatch(fetchBranches({ API_URL, token }));
      setFormData(initialFormState);
      setIsEdit(false);
      setErrors({});
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleEdit = (branch) => {
    setFormData({
      id: branch.id || '',
      code: branch.code || '',
      name: branch.name || '',
      contact_person: branch.contact_person || '',
      mobile: branch.mobile || '',
      email: branch.email || '',
      address: branch.address || '',
      pin_code: branch.pin_code || '',
    });
    setIsEdit(true);
    setErrors({});
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setIsEdit(false);
    setErrors({});
  };

  const handleDelete = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    try {
      await fetch(`${API_URL}/branch/${branchId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchBranches({ API_URL, token }));
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  const columns = [
    { label: 'Branch Code', name: 'code', required: true },
    { label: 'Branch Name', name: 'name', required: true },
    { label: 'Contact Person', name: 'contact_person', required: true },
    { label: 'Mobile Number', name: 'mobile', required: true, pattern: '\\d*' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Address', name: 'address' },
    { label: 'Pin Code', name: 'pin_code' }
  ];

  return (
  <div>
      <div className="row mb-1">
        <div className="col-12">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><a href="/dashboard">Dashboard </a></li>
            <li className="breadcrumb-item active">Branch</li>
          </ul>
        </div>
      </div>

      <div className="row">
        {/* Branch Form */}
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="fa fa-calendar-plus"></i> {isEdit ? 'Edit' : 'Add'} Branch</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {columns.map((col) => (
                    <div className="col-sm-6" key={col.name}>
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
                  <div className="col-12 mt-2 d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      {isEdit ? 'Update' : 'Submit'}
                    </button>
                    {(isEdit || Object.values(formData).some(v => v)) && (
                      <button type="button" className="btn btn-secondary ml-2" onClick={handleReset}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Branch List */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light">
              <h5><i className="fa fa-list"></i> Branch List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="bg-light">
                    <tr>
                      <th>Sr. No</th>
                      <th>Branch Code</th>
                      <th>Branch Name</th>
                      <th>Person</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Pin Code</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches && branches.length > 0 ? branches.map((branch, index) => (
                      <tr key={branch.id}>
                        <td>{index + 1}</td>
                        <td>{branch.code}</td>
                        <td>{branch.name}</td>
                        <td>{branch.contact_person}</td>
                        <td>{branch.mobile}</td>
                        <td>{branch.email}</td>
                        <td>{branch.pin_code}</td>
                        <td>
                          <ActionButton className="btn btn-sm btn-warning mr-1" onClick={() => handleEdit(branch)}>
                            Edit
                          </ActionButton>
                          <ActionButton className="btn btn-sm btn-danger" onClick={() => handleDelete(branch.id)}>
                            Delete
                          </ActionButton>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">No branches found.</td>
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

export default BranchPage;