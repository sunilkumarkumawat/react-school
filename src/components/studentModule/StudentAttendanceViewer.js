import React, { useState, useEffect } from 'react';

const StudentAttendanceViewer = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('attendance');
  const [hoveredStudentId, setHoveredStudentId] = useState(null);
  const [hoveredContact, setHoveredContact] = useState(null);


  // Load Bootstrap CSS
  useEffect(() => {
    const link = document.createElement('link');
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Generate sample day-by-day attendance data
  const generateDayByDayData = (className, month, year) => {
    const students = [
      { id: 1, name: 'John Doe', rollNo: '001', contactNumber: '9876543210', parentName: 'Mr. Robert Doe' },
      { id: 2, name: 'Jane Smith', rollNo: '002', contactNumber: '9876543211', parentName: 'Mrs. Mary Smith' },
      { id: 3, name: 'Mike Johnson', rollNo: '003', contactNumber: '9876543212', parentName: 'Mr. David Johnson' },
      { id: 4, name: 'Sarah Wilson', rollNo: '004', contactNumber: '9876543213', parentName: 'Mrs. Linda Wilson' },
      { id: 5, name: 'David Brown', rollNo: '005', contactNumber: '9876543214', parentName: 'Mr. Michael Brown' },
      { id: 6, name: 'Emily Davis', rollNo: '006', contactNumber: '9876543215', parentName: 'Mrs. Susan Davis' },
      { id: 7, name: 'Alex Taylor', rollNo: '007', contactNumber: '9876543216', parentName: 'Mr. James Taylor' },
      { id: 8, name: 'Lisa Anderson', rollNo: '008', contactNumber: '9876543217', parentName: 'Mrs. Patricia Anderson' },
    ];

    const daysInMonth = new Date(year, month, 0).getDate();
    const attendanceData = [];

    students.forEach(student => {
      const studentAttendance = {
        ...student,
        class: className,
        attendance: {},
        totalDays: daysInMonth,
        presentDays: 0,
        absentDays: 0,
        percentage: 0
      };

      // Generate random attendance for each day
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        
        // Skip Sundays (0) for attendance
        if (dayOfWeek === 0) {
          studentAttendance.attendance[day] = 'H'; // Holiday
        } else {
          // 85% chance of being present
          const isPresent = Math.random() > 0.15;
          studentAttendance.attendance[day] = isPresent ? 'P' : 'A';
          
          if (isPresent) {
            studentAttendance.presentDays++;
          } else {
            studentAttendance.absentDays++;
          }
        }
      }

      const workingDays = daysInMonth - Object.values(studentAttendance.attendance).filter(status => status === 'H').length;
      studentAttendance.percentage = workingDays > 0 ? Math.round((studentAttendance.presentDays / workingDays) * 100) : 0;
      
      attendanceData.push(studentAttendance);
    });

    return attendanceData;
  };

  const classes = ['10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleSearch = () => {
    if (!selectedClass || !selectedMonth || !selectedYear) {
      alert('Please select Class, Month, and Year before searching.');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API call
    setTimeout(() => {
      const data = generateDayByDayData(selectedClass, parseInt(selectedMonth), parseInt(selectedYear));
      setAttendanceData(data);
      setFilteredData(data);
      setLoading(false);
    }, 1000);
  };

  const resetFilters = () => {
    setSelectedClass('');
    setSelectedMonth('');
    setSelectedYear('');
    setAttendanceData([]);
    setFilteredData([]);
    setHasSearched(false);
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

  const getAttendanceCellClass = (status) => {
    switch (status) {
      case 'P': return 'bg-success text-white';
      case 'A': return 'bg-danger text-white';
      case 'H': return 'bg-secondary text-white';
      default: return '';
    }
  };

  const getDaysInMonth = () => {
    if (!selectedMonth || !selectedYear) return [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleSendMessage = (student) => {
    setSelectedStudent(student);
    setShowMessageModal(true);
    // Generate default message based on attendance
    const defaultMessage = `Dear ${student.parentName},

This is to inform you about ${student.name}'s attendance for ${months.find(m => m.value == selectedMonth)?.label} ${selectedYear}.

Attendance Summary:
- Total Working Days: ${student.totalDays - Object.values(student.attendance).filter(s => s === 'H').length}
- Present Days: ${student.presentDays}
- Absent Days: ${student.absentDays}
- Attendance Percentage: ${student.percentage}%

${student.percentage < 75 ? 'Please ensure regular attendance for better academic performance.' : 'Keep up the good work!'}

Best regards,
School Administration`;
    
    setMessageText(defaultMessage);
  };

  const sendMessageToParent = () => {
    if (!messageText.trim()) {
      alert('Please enter a message before sending.');
      return;
    }

    // Simulate sending message (SMS/WhatsApp)
    alert(`Message sent successfully to ${selectedStudent.parentName} at ${selectedStudent.contactNumber}`);
    setShowMessageModal(false);
    setMessageText('');
    setSelectedStudent(null);
  };

  const handleCall = (contactNumber) => {
    window.open(`tel:${contactNumber}`);
  };

  const handleWhatsApp = (contactNumber, studentName) => {
    const message = `Hello! This is regarding ${studentName}'s attendance. Please contact the school for more details.`;
    const whatsappUrl = `https://wa.me/${contactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="fas fa-calendar-check me-2"></i>
                &nbsp;&nbsp;Student Attendance Viewer
              </h3>
            </div>
            
            <div className="card-body">
              {/* Search Section */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <label htmlFor="classSelect" className="form-label fw-bold">
                    Select Class <span className="text-danger">*</span>
                  </label>
                  <select
                    id="classSelect"
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Choose Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label htmlFor="monthSelect" className="form-label fw-bold">
                    Select Month <span className="text-danger">*</span>
                  </label>
                  <select
                    id="monthSelect"
                    className="form-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Choose Month</option>
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="yearSelect" className="form-label fw-bold">
                    Select Year <span className="text-danger">*</span>
                  </label>
                  <select
                    id="yearSelect"
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Choose Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search me-1"></i>
                        &nbsp;&nbsp;Search
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-outline-secondary mx-2"
                    onClick={resetFilters}
                  >
                    <i className="fas fa-refresh me-1"></i>
                    &nbsp;&nbsp;Reset
                  </button>
                </div>
              </div>

              {/* Summary Cards - Only show after search */}
              {hasSearched && filteredData.length > 0 && (
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
              )}

              {/* Legend */}
              {hasSearched && filteredData.length > 0 && (
                <div className="row mb-3">
                  <div className="col-12">
                    <div className="card bg-light">
                      <div className="card-body py-2 text-center">
                        <span className="fw-bold fs-3">Legend: </span>
                        <span className="bg-success mx-2 p-1 rounded">P - Present</span>
                        <span className="bg-danger mx-2 p-1 rounded">A - Absent</span>
                        <span className="bg-secondary mx-2 p-1 rounded">H - Holiday</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Day by Day Attendance Table */}
              <div className="table-responsive">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading attendance data...</p>
                  </div>
                ) : hasSearched && filteredData.length > 0 ? (
                  <table className="table table-bordered table-sm">
                    <thead className="table-dark bg-primary">
                      <tr>
                        <th className= "text-center" style={{ minWidth: '80px' }}>Roll No</th>
                        <th className= "text-center" style={{ minWidth: '150px' }}>Student Name</th>
                        <th className= "text-center" style={{ minWidth: '130px' }}>Contact Number</th>
                        {getDaysInMonth().map(day => (
                          <th key={day} className="text-center p-3" style={{ width: '30px' }}>
                            {day}
                          </th>
                        ))}
                        <th className= "text-center" style={{ minWidth: '80px' }}>Total</th>
                        <th className= "text-center" style={{ minWidth: '80px' }}>Present</th>
                        <th className= "text-center" style={{ minWidth: '80px' }}>Absent</th>
                        <th className= "text-center" style={{ minWidth: '120px' }}>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map(student => (
                        <tr key={student.id}>
                          <td className="fw-bold text-center ">{student.rollNo}</td>
                          <td className= "text-center">{student.name}</td>
                           <td 
                            className="text-center position-relative"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredContact(student.id)}
                            onMouseLeave={() => setHoveredContact(null)}
                          >
                            <div className="align-items-center justify-content-center">
                              <span className="text-primary fw-bold me-2">
                                {student.contactNumber}
                              </span>
                              {hoveredContact === student.id && (
                                <div className=" gap-1">
                                  <button 
                                    className="flex-column btn btn-sm mx-1 px-2" 
                                    onClick={() => handleCall(student.contactNumber)}
                                    title="Call Parent"
                                    style={{ fontSize: '10px' }}
                                  >
                                  <img src="/images/png/phone-call.png" alt="WhatsApp" width={20} />
                                  </button>
                                  <button 
                                    className="flex-column btn btn-sm mx-1 px-2" 
                                    onClick={() => handleWhatsApp(student.contactNumber, student.name)}
                                    title="WhatsApp"
                                    style={{ fontSize: '10px' }}
                                  >
                                  <img src="/images/png/whatsapp.png" alt="WhatsApp" width={20} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          {getDaysInMonth().map(day => (
                            <td key={day} className={`text-center ${getAttendanceCellClass(student.attendance[day])}`}>
                              <small>{student.attendance[day]}</small>
                            </td>
                          ))}
                          <td className="text-center">{student.totalDays}</td>
                          <td className="text-center text-success fw-bold">{student.presentDays}</td>
                          <td className="text-center text-danger fw-bold">{student.absentDays}</td>
                          <td className="text-center">
                            <button 
                              className="btn btn-sm btn-hidden"
                              onClick={() => handleSendMessage(student)}
                              title="Send Message to Parent"
                            >    
                            <div>
                            <img src="/images/png/whatsapp.png" alt="WhatsApp" width={30} />
                            </div>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : hasSearched && filteredData.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-muted">
                      <i className="fas fa-search fa-3x mb-3"></i>
                      <p>No attendance records found for the selected criteria.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-muted">
                      <i className="fas fa-info-circle fa-3x mb-3"></i>
                      <p>Please select Class, Month, and Year, then click Search to view attendance records.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Export Button - Only show after successful search */}
              {hasSearched && filteredData.length > 0 && (
                <div className="row mt-3">
                  <div className="col-12 text-end">
                    <button className="btn btn-success">
                      <i className="fas fa-download me-1"></i>
                      Export to Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Modal */}
          {showMessageModal && (
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <i className="fas fa-envelope me-2"></i>
                      &nbsp;&nbsp;Send Message to Parent
                    </h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowMessageModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {selectedStudent && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-6">
                            <strong>Student:</strong> {selectedStudent.name} ({selectedStudent.rollNo})
                          </div>
                          <div className="col-md-6">
                            <strong>Parent:</strong> {selectedStudent.parentName}
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <strong>Contact:</strong> {selectedStudent.contactNumber}
                          </div>
                          <div className="col-md-6">
                            <strong>Attendance:</strong> {selectedStudent.percentage}%
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Message Type:</label>
                      <select 
                        className="form-select mx-2"
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value)}
                      >
                        <option value="attendance">Attendance Report</option>
                        <option value="performance">Performance Update</option>
                        <option value="reminder">Reminder</option>
                        <option value="custom">Custom Message</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Message:</label>
                      <textarea
                        className="form-control"
                        rows="8"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Enter your message here..."
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="card bg-light">
                          <div className="card-body py-2">
                            <small className="text-light">
                              <strong>Send Options:</strong><br/>
                              • WhatsApp Message<br/>
                              • Email (if available)
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card bg-light">
                          <div className="card-body py-2">
                            <small className="text-light">
                              <strong>Character Count:</strong> {messageText.length}/500<br/>
                              <strong>Delivery:</strong> Instant<br/>
                              <strong>Status:</strong> Will be tracked
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowMessageModal(false)}
                    >
                      &nbsp;&nbsp;Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success me-2"
                      onClick={() => handleWhatsApp(selectedStudent.contactNumber, selectedStudent.name)}
                    >
                      <i className="fab fa-whatsapp me-1"></i>
                      &nbsp;&nbsp;Send via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceViewer;