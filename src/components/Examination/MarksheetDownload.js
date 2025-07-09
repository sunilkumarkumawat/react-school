import React, { useState, useEffect } from "react";
import Select from "../common/Select";
import Input from "../common/Input";
const MarksheetDownload = () => {
  // Sample student data
  const [allStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      rollNo: "A001",
      class: "Class 10",
      exam: "Final Exam",
      section: "A",
    },
    {
      id: 2,
      name: "Jane Smith",
      rollNo: "A002",
      class: "Class 10",
      exam: "Final Exam",
      section: "A",
    },
    {
      id: 3,
      name: "Mike Johnson",
      rollNo: "A003",
      class: "Class 10",
      exam: "Mid Term",
      section: "B",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      rollNo: "B001",
      class: "Class 9",
      exam: "Final Exam",
      section: "A",
    },
    {
      id: 5,
      name: "David Brown",
      rollNo: "B002",
      class: "Class 9",
      exam: "Mid Term",
      section: "B",
    },
    {
      id: 6,
      name: "Emma Davis",
      rollNo: "C001",
      class: "Class 11",
      exam: "Final Exam",
      section: "A",
    },
    {
      id: 7,
      name: "James Miller",
      rollNo: "C002",
      class: "Class 11",
      exam: "Final Exam",
      section: "B",
    },
    {
      id: 8,
      name: "Lisa Anderson",
      rollNo: "D001",
      class: "Class 12",
      exam: "Board Exam",
      section: "A",
    },
  ]);

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showResults, setShowResults] = useState(true);

  // Get unique classes and exams for filter dropdowns
  const uniqueClasses = [
    ...new Set(allStudents.map((student) => student.class)),
  ];
  const uniqueExams = [...new Set(allStudents.map((student) => student.exam))];

  const filterColumns = [
    {
      label: "Select Class",
      name: "class",
      required: true,
      type: "select",
      options: uniqueClasses.map((cls) => ({
        value: cls,
        label: cls,
      })),
    },
    {
      label: "Select Exam",
      name: "exam",
      required: true,
      type: "select",
      options: uniqueExams.map((exam) => ({
        value: exam,
        label: exam,
      })),
    },
  ];

  // Handle search button click
  const handleSearch = () => {
    let filtered = allStudents;

    if (selectedClass) {
      filtered = filtered.filter((student) => student.class === selectedClass);
    }

    if (selectedExam) {
      filtered = filtered.filter((student) => student.exam === selectedExam);
    }

    setFilteredStudents(filtered);
    setSelectedStudents([]);
    setSelectAll(false);
    setShowResults(true);
  };

  // Reset search
  const handleReset = () => {
    setSelectedClass("");
    setSelectedExam("");
    setFilteredStudents([]);
    setSelectedStudents([]);
    setSelectAll(false);
    setShowResults(false);
  };

  // Handle individual student selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((student) => student.id));
    }
    setSelectAll(!selectAll);
  };

  // Update select all checkbox based on individual selections
  useEffect(() => {
    if (filteredStudents.length > 0) {
      setSelectAll(selectedStudents.length === filteredStudents.length);
    }
  }, [selectedStudents, filteredStudents]);

  // Handle download admit cards
  const handleDownloadAdmitCards = () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student to download admit cards.");
      return;
    }

    const selectedStudentNames = allStudents
      .filter((student) => selectedStudents.includes(student.id))
      .map((student) => student.name);

    alert(`Downloading admit cards for: ${selectedStudentNames.join(", ")}`);
    // Here you would implement the actual download logic
  };
  return (
    <div className="mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">
                <i className="fas fa-download me-2"></i> Download Marksheet
              </h4>
            </div>
            <div className="card-body">
              {/* Search Filters */}
              <div className="row mb-4">
                {filterColumns.map((col) =>
                  col.type === "select" ? (
                    <div className="col-sm-2" key={col.name}>
                      <Select
                        key={col.name}
                        label={col.label}
                        name={col.name}
                        options={col.options}
                        value={[col.name]}
                        onChange=""
                        required={col.required}
                        error=""
                      />
                    </div>
                  ) : (
                    <div className="col-sm-2" key={col.name}>
                      <Input
                        label={col.label}
                        name={col.name}
                        type={col.type || "text"}
                        value={[col.name]}
                        onChange=""
                        required={col.required}
                        error=""
                        pattern={col.pattern}
                      />
                    </div>
                  )
                )}
                <div className="col-md-3">
                  <div
                    className="d-flex"
                    style={{ margin: "20px 25px", gap: "9px" }}
                  >
                    <button className="btn btn-primary" onClick={handleSearch}>
                      <i className="fas fa-search me-2"></i> Search
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handleReset}
                    >
                      <i className="fas fa-redo me-2"></i> Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Summary and Student List - Only show after search */}
              {showResults && (
                <>
                  {/* Student List */}
                  {filteredStudents.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="bg-light">
                          <tr>
                            <th style={{ width: "9%" }}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                  id="selectAll"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="selectAll"
                                >
                                  Select All
                                </label>
                              </div>
                            </th>
                            <th>Roll No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Exam</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr key={student.id}>
                              <td>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    style={{ position: "unset" }}
                                    type="checkbox"
                                    checked={selectedStudents.includes(
                                      student.id
                                    )}
                                    onChange={() =>
                                      handleStudentSelect(student.id)
                                    }
                                    id={`student-${student.id}`}
                                  />
                                </div>
                              </td>
                              <td>
                                <strong>{student.rollNo}</strong>
                              </td>
                              <td>{student.name}</td>
                              <td>{student.class}</td>
                              <td>{student.section}</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {student.exam}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-warning text-center">
                      <i className="fas fa-exclamation-triangle me-2"></i>{' '}
                      No students found matching the selected criteria.
                    </div>
                  )}

                  {/* Download Button */}
                  <div className="row mt-4">
                    <div className="col-12 text-center">
                      <button
                        className="btn btn-success btn-lg"
                        onClick={handleDownloadAdmitCards}
                        disabled={selectedStudents.length === 0}
                      >
                        <i className="fas fa-download me-2"></i>{' '}
                        Download Selected Marksheets ({selectedStudents.length}
                        )
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Initial message when no search has been performed */}
              {!showResults && (
                <div className="text-center py-5">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>{' '}
                  <h5 className="text-muted">
                    Select class and exam, then click Search to view students
                  </h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarksheetDownload;
