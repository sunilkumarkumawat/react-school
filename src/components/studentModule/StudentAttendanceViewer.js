import React, { useState, useEffect } from 'react';

const StudentAttendanceViewer = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load Bootstrap CSS
  useEffect(() => {
    const link = document.createElement('link');
      document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Sample data - in real app, this would come from an API
  const sampleData = [
    { id: 1, name: 'John Doe', class: '10-A', rollNo: '001', totalDays: 22, presentDays: 20, absentDays: 2, percentage: 90.9 },
    { id: 2, name: 'Jane Smith', class: '10-A', rollNo: '002', totalDays: 22, presentDays: 21, absentDays: 1, percentage: 95.5 },
    { id: 3, name: 'Mike Johnson', class: '10-B', rollNo: '003', totalDays: 22, presentDays: 18, absentDays: 4, percentage: 81.8 },
    { id: 4, name: 'Sarah Wilson', class: '10-B', rollNo: '004', totalDays: 22, presentDays: 22, absentDays: 0, percentage: 100 },
    { id: 5, name: 'David Brown', class: '11-A', rollNo: '005', totalDays: 22, presentDays: 19, absentDays: 3, percentage: 86.4 },
    { id: 6, name: 'Emily Davis', class: '11-A', rollNo: '006', totalDays: 22, presentDays: 20, absentDays: 2, percentage: 90.9 },
    { id: 7, name: 'Alex Taylor', class: '11-B', rollNo: '007', totalDays: 22, presentDays: 17, absentDays: 5, percentage: 77.3 },
    { id: 8, name: 'Lisa Anderson', class: '11-B', rollNo: '008', totalDays: 22, presentDays: 21, absentDays: 1, percentage: 95.5 },
  ];

  const classes = ['10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setAttendanceData(sampleData);
      setFilteredData(sampleData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedClass, selectedMonth, attendanceData]);

  const filterData = () => {
    let filtered = [...attendanceData];
    
    if (selectedClass) {
      filtered = filtered.filter(student => student.class === selectedClass);
    }
    
    // In real app, month filtering would affect the data based on selected month
    // For now, we'll just show the same data regardless of month
    
    setFilteredData(filtered);
  };

  const getAttendanceStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-danger';
  };

  const getAttendanceStatusBadge = (percentage) => {
    if (percentage >= 90) return 'badge bg-success';
    if (percentage >= 75) return 'badge bg-warning';
    return 'badge bg-danger';
  };

  const resetFilters = () => {
    setSelectedClass('');
    setSelectedMonth('');
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="fas fa-calendar-check me-2"></i>
                Student Attendance Viewer
              </h3>
            </div>
            
            <div className="card-body">
              {/* Filter Section */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <label htmlFor="classSelect" className="form-label fw-bold">
                    Select Class
                  </label>
                  <select
                    id="classSelect"
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label htmlFor="monthSelect" className="form-label fw-bold">
                    Select Month
                  </label>
                  <select
                    id="monthSelect"
                    className="form-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Current Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={resetFilters}
                  >
                    <i className="fas fa-refresh me-1"></i>
                    Reset Filters
                  </button>
                  <button className="btn btn-success">
                    <i className="fas fa-download me-1"></i>
                    Export
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <h5 className="card-title text-primary">Total Students</h5>
                      <h3 className="text-primary">{filteredData.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <h5 className="card-title text-success">Good Attendance</h5>
                      <h3 className="text-success">
                        {filteredData.filter(s => s.percentage >= 90).length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-warning">
                    <div className="card-body text-center">
                      <h5 className="card-title text-warning">Average Attendance</h5>
                      <h3 className="text-warning">
                        {filteredData.filter(s => s.percentage >= 75 && s.percentage < 90).length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-danger">
                    <div className="card-body text-center">
                      <h5 className="card-title text-danger">Poor Attendance</h5>
                      <h3 className="text-danger">
                        {filteredData.filter(s => s.percentage < 75).length}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="table-responsive">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Total Days</th>
                        <th>Present Days</th>
                        <th>Absent Days</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map(student => (
                          <tr key={student.id}>
                            <td className="fw-bold">{student.rollNo}</td>
                            <td>{student.name}</td>
                            <td>
                              <span className="badge bg-info">{student.class}</span>
                            </td>
                            <td>{student.totalDays}</td>
                            <td className="text-success fw-bold">{student.presentDays}</td>
                            <td className="text-danger fw-bold">{student.absentDays}</td>
                            <td>
                              <span className={getAttendanceStatusColor(student.percentage)}>
                                {student.percentage}%
                              </span>
                            </td>
                            <td>
                              <span className={getAttendanceStatusBadge(student.percentage)}>
                                {student.percentage >= 90 ? 'Good' : 
                                 student.percentage >= 75 ? 'Average' : 'Poor'}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <i className="fas fa-print"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-search fa-3x mb-3"></i>
                              <p>No attendance records found for the selected criteria.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {filteredData.length > 0 && (
                <nav aria-label="Attendance pagination">
                  <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex="-1">Previous</a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link" href="#">1</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">2</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">3</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">Next</a>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceViewer;