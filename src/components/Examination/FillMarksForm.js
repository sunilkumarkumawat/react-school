import React, { useState } from "react";
import Select from "../common/Select";
import Input from "../common/Input";

const FillMarksForm = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [marks, setMarks] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [maxMarks, setMaxMarks] = useState(100);
  const [errors, setErrors] = useState({});

  // Sample data - in real app, this would come from API
  const classes = [
    { id: "1", name: "Class 1" },
    { id: "2", name: "Class 2" },
    { id: "3", name: "Class 3" },
    { id: "4", name: "Class 4" },
    { id: "5", name: "Class 5" },
    { id: "6", name: "Class 6" },
    { id: "7", name: "Class 7" },
    { id: "8", name: "Class 8" },
    { id: "9", name: "Class 9" },
    { id: "10", name: "Class 10" },
  ];

  const examTypes = [
    { id: "unit1", name: "Unit Test 1" },
    { id: "unit2", name: "Unit Test 2" },
    { id: "midterm", name: "Mid Term Exam" },
    { id: "final", name: "Final Exam" },
    { id: "annual", name: "Annual Exam" },
  ];

  const students = [
    { id: 1, name: "John Smith", rollNo: "001" },
    { id: 2, name: "Emma Johnson", rollNo: "002" },
    { id: 3, name: "Michael Brown", rollNo: "003" },
    { id: 4, name: "Sarah Davis", rollNo: "004" },
    { id: 5, name: "David Wilson", rollNo: "005" },
    { id: 6, name: "Lisa Anderson", rollNo: "006" },
    { id: 7, name: "James Miller", rollNo: "007" },
    { id: 8, name: "Anna Taylor", rollNo: "008" },
  ];

  const subjectsByClass = {
    1: ["English", "Mathematics", "Science", "Social Studies"],
    2: ["English", "Mathematics", "Science", "Social Studies"],
    3: ["English", "Mathematics", "Science", "Social Studies", "Computer"],
    4: ["English", "Mathematics", "Science", "Social Studies", "Computer"],
    5: ["English", "Mathematics", "Science", "Social Studies", "Computer"],
    6: [
      "English",
      "Mathematics",
      "Science",
      "Social Studies",
      "Computer",
      "Arts",
    ],
    7: [
      "English",
      "Mathematics",
      "Science",
      "Social Studies",
      "Computer",
      "Arts",
    ],
    8: [
      "English",
      "Mathematics",
      "Science",
      "Social Studies",
      "Computer",
      "Arts",
      "Physical Education",
    ],
    9: [
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Social Studies",
      "Computer",
      "Physical Education",
    ],
    10: [
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Social Studies",
      "Computer",
      "Physical Education",
    ],
  };

  const filterColumns = [
    {
      label: "Select Class",
      name: "class",
      required: true,
      type: "select",
      options: classes.map((cls) => ({
        value: cls.id,
        label: cls.name,
      })),
    },
    {
      label: "Select Exam",
      name: "exam",
      required: true,
      type: "select",
      options: examTypes.map((exam) => ({
        value: exam.id,
        label: exam.name,
      })),
    },
  ];

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setShowTable(false);
    setMarks({});
    setErrors({});
  };

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
    setShowTable(false);
    setMarks({});
    setErrors({});
  };

  const handleMaxMarksChange = (e) => {
    const value = parseInt(e.target.value) || 100;
    setMaxMarks(value);
    setErrors({});
  };

  const handleShowTable = () => {
    if (selectedClass && selectedExam) {
      setShowTable(true);
      // Initialize marks object
      const initialMarks = {};
      students.forEach((student) => {
        initialMarks[student.id] = {};
        subjectsByClass[selectedClass].forEach((subject) => {
          initialMarks[student.id][subject] = "";
        });
      });
      setMarks(initialMarks);
    }
  };

  const handleMarksChange = (studentId, subject, value) => {
    const numValue = parseFloat(value);
    const errorKey = `${studentId}-${subject}`;

    // Clear previous error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });

    // Validate marks
    if (
      value !== "" &&
      (isNaN(numValue) || numValue < 0 || numValue > maxMarks)
    ) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: `Marks must be between 0 and ${maxMarks}`,
      }));
      return;
    }

    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: value,
      },
    }));
  };

  const handleSubmit = () => {
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      alert("Please fix all errors before submitting!");
      return;
    }

    console.log("Marks submitted:", marks);
    console.log("Max marks:", maxMarks);
    alert("Marks submitted successfully!");
  };

  const getSelectedClassName = () => {
    const classObj = classes.find((c) => c.id === selectedClass);
    return classObj ? classObj.name : "";
  };

  const getSelectedExamName = () => {
    const examObj = examTypes.find((e) => e.id === selectedExam);
    return examObj ? examObj.name : "";
  };

  return (
    <div className="mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">
                <i className="fas fa-edit me-2"></i> Fill Marks Form
              </h4>
            </div>
            <div className="card-body">
              {/* Selection Form */}
              <div className="row mb-4">
                {/* <div className="col-md-3">
                  <label htmlFor="classSelect" className="form-label fw-bold">
                    Select Class <span className="text-danger">*</span>
                  </label>
                  <select
                    id="classSelect"
                    className="form-select"
                    value={selectedClass}
                    onChange={handleClassChange}
                  >
                    <option value="">Choose Class...</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="examSelect" className="form-label fw-bold">
                    Select Exam <span className="text-danger">*</span>
                  </label>
                  <select
                    id="examSelect"
                    className="form-select"
                    value={selectedExam}
                    onChange={handleExamChange}
                  >
                    <option value="">Choose Exam...</option>
                    {examTypes.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.name}
                      </option>
                    ))}
                  </select>
                </div> */}
                {filterColumns.map((col) =>
                  col.type === "select" ? (
                    <div className="col-sm-3" key={col.name}>
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
                    <div className="col-sm-3" key={col.name}>
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
                  <label htmlFor="maxMarks" className="form-label fw-bold">
                    Max Marks <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="maxMarks"
                    className="form-control"
                    min="1"
                    max="1000"
                    value={maxMarks}
                    onChange={handleMaxMarksChange}
                    placeholder="100"
                  />
                </div>

                <div className="col-md-3 d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleShowTable}
                    disabled={!selectedClass || !selectedExam}
                  >
                    <i className="fas fa-table me-2"></i> Show Marks Table
                  </button>
                </div>
              </div>

              {/* Marks Table */}
              {showTable && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="text-primary mb-0">
                      Marks Entry - {getSelectedClassName()} (
                      {getSelectedExamName()})
                    </h5>
                    <div className="d-flex" style={{gap:'9px'}}>
                      <span className="badge bg-info p-2">
                        Total Students: {students.length}
                      </span>
                      <span className="badge bg-warning p-2">
                        Max Marks: {maxMarks}
                      </span>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead className="bg-primary">
                        <tr>
                          <th scope="col" className="text-center">
                            Roll No
                          </th>
                          <th scope="col">Student Name</th>
                          {subjectsByClass[selectedClass].map((subject) => (
                            <th
                              key={subject}
                              scope="col"
                              className="text-center"
                            >
                              {subject}
                              <br />
                              <small className="text-muted">
                                (Max: {maxMarks})
                              </small>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td className="text-center fw-bold">
                              {student.rollNo}
                            </td>
                            <td className="fw-medium">{student.name}</td>
                            {subjectsByClass[selectedClass].map((subject) => {
                              const errorKey = `${student.id}-${subject}`;
                              const hasError = errors[errorKey];
                              return (
                                <td key={subject} className="text-center">
                                  <input
                                    type="number"
                                    className={`form-control text-center ${
                                      hasError ? "is-invalid" : ""
                                    }`}
                                    min="0"
                                    max={maxMarks}
                                    step="0.5"
                                    placeholder="0"
                                    value={marks[student.id]?.[subject] || ""}
                                    onChange={(e) =>
                                      handleMarksChange(
                                        student.id,
                                        subject,
                                        e.target.value
                                      )
                                    }
                                    style={{ width: "80px", margin: "0 auto" }}
                                  />
                                  {hasError && (
                                    <div className="invalid-feedback d-block">
                                      <small>{errors[errorKey]}</small>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      <i className="fas fa-save me-2"></i>{' '}
                      Submit Marks
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={() => setShowTable(false)}
                    >
                      <i className="fas fa-times me-2"></i>{'  '}
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FillMarksForm;
