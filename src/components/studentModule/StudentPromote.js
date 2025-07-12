import React, { useState } from 'react';

const StudentPromote = () => {
  const [currentClass, setCurrentClass] = useState('');
  const [promoteToAll, setPromoteToAll] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const classOptions = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const classOrder = {
    'Class 6': 6,
    'Class 7': 7,
    'Class 8': 8,
    'Class 9': 9,
    'Class 10': 10,
  };

  const dummyStudents = [
    { id: 1, name: 'Rohan Mehta', roll: 101, currentClass: 'Class 6', newClass: '', action: '' },
    { id: 2, name: 'Priya Sharma', roll: 102, currentClass: 'Class 6', newClass: '', action: '' },
    { id: 3, name: 'Aman Gupta', roll: 103, currentClass: 'Class 6', newClass: '', action: '' },
    { id: 4, name: 'Neha Jain', roll: 104, currentClass: 'Class 6', newClass: '', action: '' },
    { id: 5, name: 'Arjun Jain', roll: 101, currentClass: 'Class 7', newClass: '', action: '' },
    { id: 6, name: 'Kavya Patel', roll: 105, currentClass: 'Class 6', newClass: '', action: '' },
    { id: 7, name: 'Ravi Kumar', roll: 106, currentClass: 'Class 6', newClass: '', action: '' },
  ];

  const handleSearch = () => {
    if (!currentClass) {
      alert("Please select current class.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const filtered = dummyStudents.filter(std => std.currentClass === currentClass);
      setStudents(filtered);
      setShowTable(true);
      setErrors({});
      setLoading(false);
    }, 500);
  };

  const handleRollChange = (id, value) => {
    const updated = students.map(std => std.id === id ? { ...std, roll: value } : std);
    setStudents(updated);
  };

  const handleClassChange = (id, value) => {
    const updated = students.map(std => std.id === id ? { ...std, newClass: value } : std);
    setStudents(updated);
  };

  const handleActionChange = (id, value) => {
    const updated = students.map(std => std.id === id ? { ...std, action: value } : std);
    setStudents(updated);
  };

  const handlePromoteToAllChange = (value) => {
    setPromoteToAll(value);
    const updated = students.map(std => ({ ...std, newClass: value }));
    setStudents(updated);
  };

  const handleSelectAllPromote = () => {
    const updated = students.map(std => ({ ...std, action: 'Promote' }));
    setStudents(updated);
  };

const validateAndSubmit = () => {
  const newErrors = {};
  let isValid = true;

  students.forEach(student => {
    const newClass = student.newClass || promoteToAll;
    const rollValid = student.roll !== '';
    const actionValid = student.action === 'Promote' || student.action === 'Fail';

    let classValid = true;

    if (!rollValid) {
      isValid = false;
      newErrors[student.id] = "Roll number is required.";
    } else if (!actionValid) {
      isValid = false;
      newErrors[student.id] = "Select a valid action.";
    }

    if (student.action === 'Promote') {
      if (!newClass) {
        classValid = false;
        newErrors[student.id] = "Promotion class is required.";
      } else if (newClass === student.currentClass) {
        classValid = false;
        newErrors[student.id] = "Cannot promote to same class.";
      } else if (classOrder[newClass] <= classOrder[student.currentClass]) {
        classValid = false;
        newErrors[student.id] = "Promotion class must be higher than current class.";
      }
    }

    if (student.action === 'Fail') {
      if (!newClass) {
        classValid = false;
        newErrors[student.id] = "Fail class is required.";
      } else if (newClass !== student.currentClass) {
        classValid = false;
        newErrors[student.id] = "Fail class must be the same as current class.";
      }
    }

    if (!classValid) {
      isValid = false;
    }
  });

  if (!isValid) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  alert("Submission successful!");
};



  const handleExportPDF = () => {
    alert("PDF export functionality would be implemented here");
  };

  const handleExportExcel = () => {
    alert("Excel export functionality would be implemented here");
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll.toString().includes(searchTerm) ||
    s.currentClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPromotedCount = () => students.filter(s => s.action === 'Promote').length;
  const getFailedCount = () => students.filter(s => s.action === 'Fail').length;

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-orange card-outline">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="fas fa-users me-2"></i>
                &nbsp;&nbsp;Student Promotion Panel
              </h3>
            </div>
            
            <div className="card-body">
              {/* Search Section */}
              <div className="row mb-4">
                <div className="col-md-4 mt-3">
                  <label htmlFor="currentClass" className="form-label fw-bold">Select Current Class <span className="text-danger">*</span></label>
                  <br></br>
                  <select
                    id="currentClass"
                    className="form-select mt-2 w-100"
                    style={{height:'25px'}}
                    value={currentClass}
                    onChange={(e) => setCurrentClass(e.target.value)}
                  >
                    <option value="">-- Select Class --</option>
                    {classOptions.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4 mt-3">
                  <label className="form-label fw-bold d-block">Search Students</label>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search me-2"></i>
                        &nbsp;&nbsp;Search
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              {showTable && (
                <>
                  {/* Statistics Section */}
                  <div className="row mb-2">
                    <div className="col-md-12">
                      <div className="alert alert-info bg-primary">
                        <div className="row text-center">
                          <div className="col-md-3">
                            <h5 className="mb-0">{students.length}</h5>
                            <small>Total Students</small>
                          </div>
                          <div className="col-md-3">
                            <h5 className="mb-0 text-success">{getPromotedCount()}</h5>
                            <small>Promoted</small>
                          </div>
                          <div className="col-md-3">
                            <h5 className="mb-0 text-danger">{getFailedCount()}</h5>
                            <small>Failed</small>
                          </div>
                          <div className="col-md-3">
                            <h5 className="mb-0 text-warning">{students.length - getPromotedCount() - getFailedCount()}</h5>
                            <small>Pending</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls Section */}
                  <div className="row mb-4">
                    <div className="col-md-4 mt-3">
                      <label htmlFor="searchStudent" className="form-label fw-bold">Search Students</label>
                      <input
                        id="searchStudent"
                        type="text"
                        className="form-control mt-2 w-100"
                        placeholder="Search by name, roll or class..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-md-4 mt-3">
                      <label htmlFor="promoteAll" className="form-label fw-bold">Promote All To Class</label>
                      <br></br>
                      <select
                        id="promoteAll"
                        className="form-select mt-2 w-100"
                        style={{height:'23px'}}
                        value={promoteToAll}
                        onChange={(e) => handlePromoteToAllChange(e.target.value)}
                      >
                        <option value="">-- Select Class --</option>
                        {classOptions.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-md-4 mt-2">
                      <label className="form-label fw-bold d-block my-1">Quick Actions</label>
                      <button
                        className="btn btn-success mt-2"
                        onClick={handleSelectAllPromote}
                        disabled={students.length === 0}
                      >
                        <i className="fas fa-check me-2"></i>
                        &nbsp;&nbsp;All Promote
                      </button>
                    </div>
                  </div>

                  {/* Students Table */}
                  <div className="table-responsive">
                    {filteredStudents.length === 0 ? (
                      <div className="alert alert-warning text-center">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        No students found matching your criteria.
                      </div>
                    ) : (
                      <table className="table table-striped table-hover">
                        <thead className="bg-primary">
                          <tr>
                            <th scope="col" style={{ width: '8%' }}>Sr. No.</th>
                            <th scope="col" style={{ width: '20%' }}>Student Name</th>
                            <th scope="col" style={{ width: '12%' }}>Roll No.</th>
                            <th scope="col" style={{ width: '15%' }}>Current Class</th>
                            <th scope="col" style={{ width: '15%' }}>Promote To</th>
                            <th scope="col" style={{ width: '15%' }}>Action</th>
                            <th scope="col" style={{ width: '15%' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student, idx) => (
                            <tr key={student.id}>
                              <td className="fw-bold">{idx + 1}</td>
                              <td>{student.name}</td>
                              <td>
                                <input
                                  type="number"
                                  value={student.roll}
                                  onChange={(e) => handleRollChange(student.id, e.target.value)}
                                  className="form-control form-control-sm"
                                  style={{ width: '80px' }}
                                />
                              </td>
                              <td>
                                <span className="badge bg-secondary w-50">{student.currentClass}</span>
                              </td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={student.newClass || ''}
                                  onChange={(e) => handleClassChange(student.id, e.target.value)}
                                >
                                  <option value="">-- Select --</option>
                                  {classOptions.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={student.action}
                                  onChange={(e) => handleActionChange(student.id, e.target.value)}
                                >
                                  <option value="">-- Select --</option>
                                  <option value="Promote">Promote</option>
                                  <option value="Fail">Fail</option>
                                </select>
                              </td>
                              <td>
                                {errors[student.id] ? (
                                  <span className="text-danger small">{errors[student.id]}</span>
                                ) : student.action === 'Promote' ? (
                                  <span className="badge bg-success w-50">
                                    <i className="fas fa-check me-1"></i>
                                    Promote
                                  </span>
                                ) : student.action === 'Fail' ? (
                                  <span className="badge bg-danger w-50">
                                    <i className="fas fa-times me-1"></i>
                                    Fail
                                  </span>
                                ) : (
                                  <span className="badge bg-warning w-50">Pending</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="row mt-4">
                    <div className="col-12 text-center">
                      <button 
                        className="btn btn-primary my-1"
                        onClick={validateAndSubmit}
                      >
                        <i className="fas fa-save me-2"></i>
                        &nbsp;&nbsp;Submit
                      </button>
                      <button 
                        className="btn btn-secondary ml-2 my-1"
                        onClick={handleExportPDF}
                      >
                        <i className="fas fa-file-pdf me-2"></i>
                        &nbsp;&nbsp;PDF
                      </button>
                      <button 
                        className="btn btn-info ml-2 my-1"
                        onClick={handleExportExcel}
                      >
                        <i className="fas fa-file-excel me-2"></i>
                        &nbsp;&nbsp;Excel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPromote;