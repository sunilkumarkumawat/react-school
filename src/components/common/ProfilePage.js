import React, { useState } from 'react';
import Input from './Input';
import { validateFields } from '../../utils/validation';

const initialState = {
  photo: '',
  father_img: '',
  mother_img: '',
  userName: '',
  first_name: '',
  aadhaar: '',
  gender_id: '',
  class_type_id: '',
  dob: '',
  mobile: '',
  email: '',
  father_name: '',
};

const genders = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
];

const classTypes = [
  { id: 1, name: 'Class 1' },
  { id: 2, name: 'Class 2' },
];

const columns = [
  { label: 'Profile Photo', name: 'photo', type: 'file' },
  { label: 'Father Photo', name: 'father_img', type: 'file' },
  { label: 'Mother Photo', name: 'mother_img', type: 'file' },
  { label: 'User Name', name: 'userName', type: 'text', readOnly: false },
  { label: 'Name', name: 'first_name', type: 'text', required: false },
  { label: 'Aadhaar No.', name: 'aadhaar', type: 'text', maxLength: 12, readOnly: false },
  { label: 'Gender', name: 'gender_id', type: 'select', options: genders, disabled: false },
  { label: 'Class', name: 'class_type_id', type: 'select', options: classTypes, disabled: false },
  { label: 'Date of Birth', name: 'dob', type: 'date' },
  { label: 'Mobile', name: 'mobile', type: 'text', maxLength: 10 },
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Father Name', name: 'father_name', type: 'text' },
];

const ProfilePage = () => {
  const [formData, setFormData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (name === 'photo') {
        setImagePreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get required fields from columns
    const requiredFields = columns.filter(col => col.required).map(col => col.name);

    // Validate fields
    const validationErrors = validateFields(requiredFields, formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit logic here
    alert('Profile updated!');
  };

  return (
  
          <div className="row">
            <div className="col-12">
              <div className="card card-outline card-orange">
                <div className="card-header bg-primary d-flex justify-content-between align-items-center">
                  <h3 className="card-title">
                    <i className="fa fa-user-circle-o"></i> &nbsp; View Profile
                  </h3>
                  <div className="card-tools">
                    <a href="/dashboard" className="btn btn-primary btn-xs">
                      <i className="fa fa-arrow-left"></i> <span>Back</span>
                    </a>
                  </div>
                </div>
                <div className="card-body box-profile">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row mb-3">
                      {columns.map((col) => (
                        <div className="col-sm-6" key={col.name}>
                          {col.type === 'select' ? (
                            <div className="form-group">
                              <label>
                                {col.label} {col.required && <span style={{ color: 'red' }}>*</span>}
                              </label>
                              <select
                                className="form-control"
                                name={col.name}
                                value={formData[col.name]}
                                onChange={handleChange}
                                disabled={col.disabled}
                              >
                                <option value="">Select</option>
                                {col.options && col.options.map(opt => (
                                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                                ))}
                              </select>
                              {errors[col.name] && (
                                <div className="invalid-feedback d-block">{errors[col.name]}</div>
                              )}
                            </div>
                          ) : (
                            <Input
                              label={col.label}
                              name={col.name}
                              type={col.type || 'text'}
                              value={col.type === 'file' ? undefined : formData[col.name]}
                              onChange={handleChange}
                              required={col.required}
                              error={errors[col.name]}
                              pattern={col.pattern}
                              maxLength={col.maxLength}
                              readOnly={col.readOnly}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Submit */}
                    <div className="text-center mt-3">
                      <button type="submit" className="btn btn-success">Update Profile</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
      
  );
};

export default ProfilePage;