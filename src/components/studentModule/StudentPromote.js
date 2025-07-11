import React, { useState } from 'react';
import { Search, Users, Download, FileText, CheckCircle, XCircle, Filter, UserCheck } from 'lucide-react';

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

      if (!rollValid) {
        isValid = false;
        newErrors[student.id] = "Roll number is required.";
      } else if (!actionValid) {
        isValid = false;
        newErrors[student.id] = "Select a valid action.";
      } else if (!classValid) {
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="card card-orange card-outline">
          <div className=" card-header bg-light card-body text-center">
            <div className="d-flex mb-3">
              <Users className="mt-3" size={25} />
              <h3 className="card-title mb-0 fw-bold mt-3">Student Promotion Panel</h3>
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-6 col-lg-4">
                <label className="form-label fw-semibold">
                  Select Current Class
                </label>
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-4 mb-3">
                    <select
                      className="form-select w-100"
                      style={{height:'23px'}}
                      value={currentClass}
                      onChange={(e) => setCurrentClass(e.target.value)}
                    >
                      <option value="">-- Select Class --</option>
                      {classOptions.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
              <div className="col-md-6 col-lg-4 my-2">
                <button
                  className="btn btn-primary d-flex align-items-center justify-content-center"
                  style={{width:'100px'}}
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
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        {/* Results Section */}
        {showTable && (
          <>
            {/* Stats Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="card-text text-muted small mb-1">Total Students</p>
                        <h3 className="card-title mb-0">{students.length}</h3>
                      </div>
                      <Users className="text-primary" size={32} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="card-text text-muted small mb-1">Promoted</p>
                        <h3 className="card-title mb-0 text-success">{getPromotedCount()}</h3>
                      </div>
                      <CheckCircle className="text-success" size={32} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="card-text text-muted small mb-1">Failed</p>
                        <h3 className="card-title mb-0 text-danger">{getFailedCount()}</h3>
                      </div>
                      <XCircle className="text-danger" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  
                  {/* Search Students */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold" htmlFor="searchStudent">
                      Search Students
                    </label>
                    <input
                      id="searchStudent"
                      type="text"
                      className="form-control"
                      placeholder="Search by name, roll or class"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Promote All To Class */}
                  <div className="col-12 col-md-4 mt-3">
                    <label className="form-label fw-semibold" htmlFor="promoteAll">
                      Promote All To Class
                    </label>
                    <select
                      id="promoteAll"
                      className="form-select w-100"
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

                  {/* Select All Promote Button */}
                  <div className="col-12 col-md-4">
                    <button
                      className="btn btn-success d-flex align-items-center justify-content-center mt-4"
                      style={{width:'105px'}}
                      onClick={handleSelectAllPromote}
                    >
                      All Promote
                    </button>
                  </div>

                </div>
              </div>
            </div>


            {/* Table */}
            <div className="card shadow-sm mb-4">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-primary bg-primary text-center">
                      <tr>
                        <th className="px-3 py-3">Sr. No.</th>
                        <th className="px-3 py-3">Name</th>
                        <th className="px-3 py-3">Roll No.</th>
                        <th className="px-3 py-3">Current Class</th>
                        <th className="px-3 py-3">Promote To</th>
                        <th className="px-3 py-3">Action</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, idx) => (
                        <tr key={student.id}>
                          <td className="px-3 py-3 text-center">{idx + 1}</td>
                          <td className="px-3 py-3 fw-medium text-center">{student.name}</td>
                          <td className="px-3 py-3">
                          <div className="d-flex justify-content-center align-items-center">
                            <input
                              type="number"
                              value={student.roll}
                              onChange={(e) => handleRollChange(student.id, e.target.value)}
                              className="form-control form-control-sm text-center"
                              style={{ width: '80px' }}
                            />
                          </div>
                          </td>
                          <td className="px-3 py-3 text-center">{student.currentClass}</td>
                          <td className="px-3 py-3 text-center align-middle">
                            <div className="d-flex justify-content-center align-items-center">
                              <select
                                className="form-select form-select-sm text-center"
                                value={student.newClass || ''}
                                onChange={(e) => handleClassChange(student.id, e.target.value)}
                                style={{ width: '120px' }}  // optional: control width
                              >
                                <option value="">-- Select --</option>
                                {classOptions.map(cls => (
                                  <option key={cls} value={cls}>{cls}</option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center align-middle">
                            <div className="d-flex justify-content-center align-items-center">
                              <select
                                className="form-select form-select-sm text-center"
                                value={student.action}
                                onChange={(e) => handleActionChange(student.id, e.target.value)}
                                style={{ width: '120px' }}  // Optional: control size
                              >
                                <option value="">-- Select --</option>
                                <option value="Promote">Promote</option>
                                <option value="Fail">Fail</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            {errors[student.id] ? (
                              <span className="text-danger small">{errors[student.id]}</span>
                            ) : student.action === 'Promote' ? (
                              <span className="badge bg-success d-flex align-items-center" style={{ width: 'fit-content' }}>
                                <CheckCircle className="me-1" size={12} />
                                Promote
                              </span>
                            ) : student.action === 'Fail' ? (
                              <span className="badge bg-danger d-flex align-items-center" style={{ width: 'fit-content' }}>
                                <XCircle className="me-1" size={12} />
                                Fail
                              </span>
                            ) : (
                              <span className="text-muted small">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  
                  <button
                    className="btn btn-primary d-flex align-items-center justify-content-center mx-2"
                    onClick={validateAndSubmit}
                  >
                    Submit
                  </button>

                  <button
                    className="btn btn-danger d-flex align-items-center justify-content-center mx-2"
                    onClick={handleExportPDF}
                  >
                    PDF
                  </button>

                  <button
                    className="btn btn-success d-flex align-items-center justify-content-center mx-2"
                    onClick={handleExportExcel}
                  >
                    Excel
                  </button>

                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default StudentPromote;