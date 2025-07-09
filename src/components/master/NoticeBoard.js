import React, { useState } from 'react';
import ActionButton from '../common/ActionButton';

const NoticeManagement = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    fromDate: '',
    toDate: '',
    sendTo: []
  });

  const [notices, setNotices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roles = [
    { id: 'admin', name: 'Admin' },
    { id: 'teacher', name: 'Teacher' },
    { id: 'student', name: 'Student' },
    { id: 'hostel', name: 'Hostel' },
    { id: 'sub-admin', name: 'Sub Admin' },
    { id: 'principal', name: 'Principal' },
    { id: 'receptionist', name: 'Receptionist' },
    { id: 'accounts', name: 'Accounts' },
    { id: 'coordinator', name: 'Coordinator' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleToggle = (roleId) => {
    setFormData(prev => ({
      ...prev,
      sendTo: prev.sendTo.includes(roleId)
        ? prev.sendTo.filter(id => id !== roleId)
        : [...prev.sendTo, roleId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message || !formData.fromDate || !formData.toDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.sendTo.length === 0) {
      alert('Please select at least one recipient role');
      return;
    }

    const newNotice = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setNotices(prev => [...prev, newNotice]);

    // Reset form
    setFormData({
      title: '',
      message: '',
      fromDate: '',
      toDate: '',
      sendTo: []
    });

    setDropdownOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setNotices(prev => prev.filter(notice => notice.id !== id));
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-IN') : '-';
  };

  return (
    <div >
      {/* Add Notice Form */}
      <div className="card card-orange card-outline">
        <div className="card-header bg-light">
          <h4 className="card-title"><i class="fa-solid fa-envelope"></i>  Add Notice</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Send To */}
              <div className="col-md-4">
                <div className="card card-outline">
                  <div className="card-header bg-light">
                    <h4><i class="fa-solid fa-users-line"></i> Send To</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Select Recipients *</label>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          {formData.sendTo.length > 0
                            ? `${formData.sendTo.length} role(s) selected`
                            : 'Choose roles...'}
                        </button>
                        {dropdownOpen && (
                          <div className="dropdown-menu show w-100 p-2" style={{ position: 'relative' }}>
                            {roles.map(role => (
                              <div key={role.id} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`role-${role.id}`}
                                  checked={formData.sendTo.includes(role.id)}
                                  onChange={() => handleRoleToggle(role.id)}
                                />
                                <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                  {role.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {formData.sendTo.length > 0 && (
                        <div className="mt-2">
                          <small className="text-muted">Selected roles:</small>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {formData.sendTo.map(roleId => {
                              const role = roles.find(r => r.id === roleId);
                              return (
                                <span key={roleId} className="badge bg-primary">
                                  {role?.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">From Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">To Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title + Message */}
              <div className="col-md-8">
                <div className="card card-outline">
                  <div className="card-header bg-light">
                    <h4><i class="fa-solid fa-message"></i> Notice Details</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message *</label>
                      <textarea
                        className="form-control"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="8"
                        placeholder="Enter notice message"
                        required
                      ></textarea>
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Submit Notice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Published Notices Table */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card card-outline">
            <div className="card-header bg-light">
              <h4 className="card-title"><i class="fa-solid fa-eye"></i> Published Notices</h4>
            </div>
            <div className="card-body">
              {notices.length === 0 ? (
                <div className="text-center py-4 text-muted">No notices published yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered table-striped">
                    <thead className="bg-light">
                      <tr>
                        <th>Sr. No.</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Recipients</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notices.map((notice, index) => (
                        <tr key={notice.id}>
                          <td>{index + 1}</td>
                          <td className="text-primary fw-medium">{notice.title}</td>
                          <td style={{ maxWidth: '200px' }} className="text-truncate">{notice.message}</td>
                          <td>{formatDate(notice.fromDate)}</td>
                          <td>{formatDate(notice.toDate)}</td>
                          <td>
                            {notice.sendTo.map(roleId => {
                              const role = roles.find(r => r.id === roleId);
                              return (
                                <span key={roleId} className="badge bg-primary me-1">
                                  {role?.name}
                                </span>
                              );
                            })}
                          </td>
                          <td className="text-center">

                            <ActionButton
                              className="text-warning mr-1"
                            // onClick={() => handleEdit(row)}
                            >
                              Edit
                            </ActionButton>
                            <ActionButton
                              className="text-danger"
                            // onClick={() => handleDelete(row.id,'' )}
                            >
                              Delete
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Inline Styles */}
      <style>{`
        .dropdown-menu.show {
          display: block;
          max-height: 300px;
          overflow-y: auto;
        }
        .text-truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

export default NoticeManagement;
