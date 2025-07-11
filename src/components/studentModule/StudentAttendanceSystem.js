import React, { useState } from 'react';

const StudentAttendanceSystem = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample data - in real app, this would come from API
  const classes = [
    'Class 1A', 'Class 1B', 'Class 2A', 'Class 2B', 
    'Class 3A', 'Class 3B', 'Class 4A', 'Class 4B',
    'Class 5A', 'Class 5B'
  ];

  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: 'John Smith', 
      rollNo: '001', 
      admissionNo: 'ADM001',
      class: 'Class 1A', 
      fatherName: 'Robert Smith',
      motherName: 'Mary Smith',
      dateOfBirth: '2010-05-15',
      status: 'present'
    },
    { 
      id: 2, 
      name: 'Emma Johnson', 
      rollNo: '002', 
      admissionNo: 'ADM002',
      class: 'Class 1A', 
      fatherName: 'David Johnson',
      motherName: 'Susan Johnson',
      dateOfBirth: '2010-08-22',
      status: 'present'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      rollNo: '003', 
      admissionNo: 'ADM003',
      class: 'Class 1A', 
      fatherName: 'James Brown',
      motherName: 'Patricia Brown',
      dateOfBirth: '2010-03-10',
      status: 'absent'
    },
    { 
      id: 4, 
      name: 'Sarah Davis', 
      rollNo: '004', 
      admissionNo: 'ADM004',
      class: 'Class 1B', 
      fatherName: 'Thomas Davis',
      motherName: 'Linda Davis',
      dateOfBirth: '2010-12-01',
      status: 'present'
    },
    { 
      id: 5, 
      name: 'David Wilson', 
      rollNo: '005', 
      admissionNo: 'ADM005',
      class: 'Class 1B', 
      fatherName: 'Christopher Wilson',
      motherName: 'Barbara Wilson',
      dateOfBirth: '2010-07-18',
      status: 'leave'
    },
    { 
      id: 6, 
      name: 'Lisa Anderson', 
      rollNo: '006', 
      admissionNo: 'ADM006',
      class: 'Class 2A', 
      fatherName: 'Matthew Anderson',
      motherName: 'Elizabeth Anderson',
      dateOfBirth: '2009-11-05',
      status: 'present'
    },
    { 
      id: 7, 
      name: 'Robert Taylor', 
      rollNo: '007', 
      admissionNo: 'ADM007',
      class: 'Class 2A', 
      fatherName: 'Daniel Taylor',
      motherName: 'Jennifer Taylor',
      dateOfBirth: '2009-09-30',
      status: 'holiday'
    },
    { 
      id: 8, 
      name: 'Jennifer Martinez', 
      rollNo: '008', 
      admissionNo: 'ADM008',
      class: 'Class 2B', 
      fatherName: 'Anthony Martinez',
      motherName: 'Maria Martinez',
      dateOfBirth: '2009-06-14',
      status: 'absent'
    },
    { 
      id: 9, 
      name: 'William Garcia', 
      rollNo: '009', 
      admissionNo: 'ADM009',
      class: 'Class 2B', 
      fatherName: 'Mark Garcia',
      motherName: 'Nancy Garcia',
      dateOfBirth: '2009-04-25',
      status: 'present'
    },
    { 
      id: 10, 
      name: 'Ashley Rodriguez', 
      rollNo: '010', 
      admissionNo: 'ADM010',
      class: 'Class 3A', 
      fatherName: 'Steven Rodriguez',
      motherName: 'Sandra Rodriguez',
      dateOfBirth: '2008-10-12',
      status: 'leave'
    },
  ]);

  // Academic Calendar Data
  const academicCalendar = [
    { date: '2025-07-01', event: 'Summer Vacation Ends', type: 'holiday' },
    { date: '2025-07-02', event: 'Classes Resume', type: 'academic' },
    { date: '2025-07-08', event: 'Today', type: 'today' },
    { date: '2025-07-15', event: 'Monthly Test', type: 'exam' },
    { date: '2025-07-20', event: 'Parent-Teacher Meeting', type: 'meeting' },
    { date: '2025-07-25', event: 'Sports Day', type: 'event' },
    { date: '2025-08-01', event: 'Admission Open', type: 'admission' },
    { date: '2025-08-05', event: 'Mid-Term Exam', type: 'exam' },
    { date: '2025-08-15', event: 'Independence Day', type: 'holiday' },
    { date: '2025-08-20', event: 'Science Fair', type: 'event' },
    { date: '2025-08-25', event: 'Result Declaration', type: 'result' },
    { date: '2025-09-01', event: 'New Session Begins', type: 'academic' },
    { date: '2025-09-05', event: 'Teachers Day', type: 'holiday' },
    { date: '2025-09-10', event: 'Annual Function', type: 'event' },
    { date: '2025-09-15', event: 'Half Yearly Exam', type: 'exam' },
    { date: '2025-09-20', event: 'Diwali Break Starts', type: 'holiday' },
  ];

  // Get event type color
  const getEventTypeColor = (type) => {
    const colors = {
      'academic': 'primary',
      'exam': 'danger',
      'holiday': 'success',
      'meeting': 'warning',
      'event': 'info',
      'admission': 'secondary',
      'result': 'dark',
      'today': 'light'
    };
    return colors[type] || 'secondary';
  };

  // Status options for attendance
  const statusOptions = [
    { value: 'present', label: 'Present', color: 'success' },
    { value: 'absent', label: 'Absent', color: 'danger' },
    { value: 'leave', label: 'Leave', color: 'warning' },
    { value: 'holiday', label: 'Holiday', color: 'info' },
    { value: 'late', label: 'Late', color: 'secondary' },
    { value: 'excused', label: 'Excused', color: 'primary' }
  ];

  // Filter students based on selected class and search term
  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === '' || student.class === selectedClass;
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase())||
      student.motherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Change student status
  const changeStudentStatus = (studentId, newStatus) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, status: newStatus }
          : student
      )
    );
  };

  // Mark all filtered students as present
  const markAllPresent = () => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        filteredStudents.find(fs => fs.id === student.id)
          ? { ...student, status: 'present' }
          : student
      )
    );
  };

  // Mark all filtered students as absent
  const markAllAbsent = () => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        filteredStudents.find(fs => fs.id === student.id)
          ? { ...student, status: 'absent' }
          : student
      )
    );
  };

  // Calculate attendance statistics
  const presentCount = filteredStudents.filter(student => student.status === 'present').length;
  const absentCount = filteredStudents.filter(student => student.status === 'absent').length;
  const leaveCount = filteredStudents.filter(student => student.status === 'leave').length;
  const holidayCount = filteredStudents.filter(student => student.status === 'holiday').length;
  const totalCount = filteredStudents.length;
  const attendancePercentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Get status color and label
  const getStatusInfo = (status) => {
    const statusInfo = statusOptions.find(option => option.value === status);
    return statusInfo || { value: status, label: status, color: 'secondary' };
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Main Content - Left Side */}
        <div className="col-lg-8 col-md-12">
          <div className="card card-orange card-outline">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="fas fa-users me-2"></i>
                &nbsp;&nbsp;Student Attendance System
              </h3>
            </div>
            
            <div className="card-body">
              {/* Controls Section */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <label htmlFor="dateInput" className="form-label fw-bold">Date</label>
                  <input
                    type="date"
                    id="dateInput"
                    className="form-control"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>
                
                <div className="col-md-2 my-1">
                  <label htmlFor="classSelect" className="form-label fw-bold my-1">Filter by Class</label>
                  <br></br>
                  <select
                    id="classSelect"
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {classes.map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-3 my-1">
                  <label htmlFor="searchInput" className="form-label fw-bold">Search Student</label>
                  <input
                    type="text"
                    id="searchInput"
                    className="form-control"
                    placeholder="Search by name, roll number, or admission number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label fw-bold d-block my-1">Quick Actions</label>
                  <div className="d-flex" style={{gap:'9px'}}>
                    <button
                      className="btn btn-success"
                      onClick={markAllPresent}
                      disabled={filteredStudents.length === 0}
                    >
                      All Present
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={markAllAbsent}
                      disabled={filteredStudents.length === 0}
                    >
                      All Absent
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="alert alert-info bg-primary">
                    <div className="row text-center">
                      <div className="col-md-2">
                        <h5 className="mb-0">{totalCount}</h5>
                        <small>Total Students</small>
                      </div>
                      <div className="col-md-2">
                        <h5 className="mb-0 text-success">{presentCount}</h5>
                        <small>Present</small>
                      </div>
                      <div className="col-md-2">
                        <h5 className="mb-0 text-danger">{absentCount}</h5>
                        <small>Absent</small>
                      </div>
                      <div className="col-md-2">
                        <h5 className="mb-0 text-warning">{leaveCount}</h5>
                        <small>On Leave</small>
                      </div>
                      <div className="col-md-2">
                        <h5 className="mb-0 text-info">{holidayCount}</h5>
                        <small>Holiday</small>
                      </div>
                      <div className="col-md-2">
                        <h5 className="mb-0 text-primary">{attendancePercentage}%</h5>
                        <small>Attendance Rate</small>
                      </div>
                    </div>
                  </div>
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
                        <th scope="col" style={{ width: '7%' }}>Roll No.</th>
                        <th scope="col" style={{ width: '8%' }}>Admission No.</th>
                        <th scope="col" style={{ width: '13%' }}>Student Name</th>
                        <th scope="col" style={{ width: '8%' }}>Class</th>
                        <th scope="col" style={{ width: '11%' }}>Father's Name</th>
                        <th scope="col" style={{ width: '11%' }}>Mother's Name</th>
                        <th scope="col" style={{ width: '9%' }}>Date of Birth</th>
                        <th scope="col" style={{ width: '6%' }}>Age</th>
                        <th scope="col" style={{ width: '8%' }}>Status</th>
                        <th scope="col" style={{ width: '13%' }}>Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => {
                        const statusInfo = getStatusInfo(student.status);
                        return (
                          <tr key={student.id} className={`table-${statusInfo.color === 'success' ? 'success' : 'light'}`}>
                            <td className="fw-bold">{student.rollNo}</td>
                            <td className="fw-bold text-primary">{student.admissionNo}</td>
                            <td>{student.name}</td>
                            <td>
                              <span className="badge bg-secondary">{student.class}</span>
                            </td>
                            <td className="text-muted">{student.fatherName}</td>
                            <td className="text-muted">{student.motherName}</td>
                            <td className="text-muted">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                            <td>
                              <span className="badge bg-info">{calculateAge(student.dateOfBirth)} years</span>
                            </td>
                            <td>
                              <span className={`badge bg-${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={student.status}
                                onChange={(e) => changeStudentStatus(student.id, e.target.value)}
                              >
                                {statusOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Action Buttons */}
              <div className="row mt-4">
                <div className="col-12 text-center">
                  <button className="btn btn-primary my-1">
                    <i className="fas fa-save me-2"></i>
                    &nbsp;&nbsp;Save Attendance
                  </button>
                  <button className="btn btn-secondary ml-2 my-1">
                    <i className="fas fa-print me-2"></i>
                    &nbsp;&nbsp;Print Report
                  </button>
                  <button className="btn btn-info ml-2 my-1">
                    <i className="fas fa-download me-2"></i>
                    &nbsp;&nbsp;Export Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  {/* Academic Calendar - Right Side with Tab Panel in Table Format */}
  <div className="col-lg-4 col-md-12">
  <div className="card card-orange card-outline">
    <div className="card-header bg-primary text-white">
      <h5 className="card-title mb-0">
        <i className="fas fa-calendar-alt me-2"></i>
        &nbsp;&nbsp;Academic Calendar
      </h5>
    </div>

    <div className="card-body" style={{ maxHeight: '800px', overflowY: 'auto' }}>
      <div className="mb-3">
        <small className="text-muted">Current Academic Year: 2025–26</small>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3" id="calendarTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="this-month-tab"
            data-bs-toggle="tab"
            data-bs-target="#this-month"
            type="button"
            role="tab"
            aria-controls="this-month"
            aria-selected="true"
          >
            This Month
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="full-calendar-tab"
            data-bs-toggle="tab"
            data-bs-target="#full-calendar"
            type="button"
            role="tab"
            aria-controls="full-calendar"
            aria-selected="false"
          >
            Full Calendar
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content" id="calendarTabContent">
        {/* This Month Tab */}
        <div
          className="tab-pane fade show active"
          id="this-month"
          role="tabpanel"
          aria-labelledby="this-month-tab"
        >
          {academicCalendar.filter((item) => {
            const eventDate = new Date(item.date);
            const now = new Date();
            return (
              eventDate.getMonth() === now.getMonth() &&
              eventDate.getFullYear() === now.getFullYear()
            );
          }).length === 0 ? (
            <div className="alert alert-warning text-center">No events this month.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <thead className="table-primary text-center bg-primary">
                  <tr>
                    <th>Date</th>
                    <th>Event</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {academicCalendar
                    .filter((item) => {
                      const eventDate = new Date(item.date);
                      const now = new Date();
                      return (
                        eventDate.getMonth() === now.getMonth() &&
                        eventDate.getFullYear() === now.getFullYear()
                      );
                    })
                    .map((item, index) => {
                      const eventDate = new Date(item.date);
                      const isToday = eventDate.toDateString() === new Date().toDateString();
                      return (
                        <tr key={index} className={isToday ? 'table-warning' : ''}>
                          <td>{eventDate.toLocaleDateString()}</td>
                          <td>
                            {item.event}{' '}
                            {isToday && (
                              <span className="badge bg-warning text-dark ms-1">Today</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge bg-${getEventTypeColor(item.type)}`}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Full Calendar Tab */}
        <div
          className="tab-pane fade"
          id="full-calendar"
          role="tabpanel"
          aria-labelledby="full-calendar-tab"
        >
          <div className="table-responsive">
            <table className="table table-bordered table-sm">
              <thead className="table-primary text-center bg-primary">
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {academicCalendar.map((item, index) => {
                  const eventDate = new Date(item.date);
                  const isToday = eventDate.toDateString() === new Date().toDateString();
                  return (
                    <tr key={index} className={isToday ? 'table-warning' : ''}>
                      <td>{eventDate.toLocaleDateString()}</td>
                      <td>
                        {item.event}{' '}
                        {isToday && (
                          <span className="badge bg-warning text-dark ms-1">Today</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge bg-${getEventTypeColor(item.type)}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</div>
</div>

  );
};

export default StudentAttendanceSystem;