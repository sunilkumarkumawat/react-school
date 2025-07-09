import React, { useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import Input from "../common/Input";
import Select from "../common/Select";

const ExamScheduleForm = () => {
  const [examSchedules, setExamSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState({
    id: null,
    examName: "",
    className: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    venue: "",
    invigilator: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const examTypes = [
    "Mid-Term Examination",
    "Final Examination",
    "Unit Test 1",
    "Unit Test 2",
    "Quarterly Examination",
    "Half-Yearly Examination",
    "Annual Examination",
    "Supplementary Examination",
  ];

  const classes = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];

  const subjects = [
    "Mathematics",
    "English",
    "Science",
    "Social Studies",
    "Hindi",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Political Science",
    "Philosophy",
  ];

  const columns = [
    {
      label: "Exam Name",
      name: "examTypes",
      required: true,
      type: "select",
      options: examTypes.map((exam) => ({
        value: exam,
        label: exam,
      })),
    },
    {
      label: "Class",
      name: "class",
      required: true,
      type: "select",
      options: classes.map((classe) => ({
        value: classe,
        label: classe,
      })),
    },
    {
      label: "Subject",
      name: "subject",
      required: true,
      type: "select",
      options: subjects.map((subject) => ({
        value: subject,
        label: subject,
      })),
    },
    { label: "Date", name: "name", required: true },
    { label: "Time", name: "name", required: true },
    { label: "Duration (hours)", name: "name", required: true },
    { label: "Venue", name: "name", required: true },
    { label: "Invigilator", name: "name", required: true },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !currentSchedule.examName ||
      !currentSchedule.className ||
      !currentSchedule.subject ||
      !currentSchedule.date ||
      !currentSchedule.time ||
      !currentSchedule.duration ||
      !currentSchedule.venue ||
      !currentSchedule.invigilator
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (isEditing) {
      setExamSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === currentSchedule.id ? currentSchedule : schedule
        )
      );
      setIsEditing(false);
    } else {
      const newSchedule = {
        ...currentSchedule,
        id: Date.now(),
      };
      setExamSchedules((prev) => [...prev, newSchedule]);
    }

    setCurrentSchedule({
      id: null,
      examName: "",
      className: "",
      subject: "",
      date: "",
      time: "",
      duration: "",
      venue: "",
      invigilator: "",
    });
  };

  const handleEdit = (schedule) => {
    setCurrentSchedule(schedule);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setExamSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  const groupedSchedules = examSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.className]) {
      acc[schedule.className] = [];
    }
    acc[schedule.className].push(schedule);
    return acc;
  }, {});

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="row g-4">
            {/* Form Section */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                {/* <div className="card-header bg-primary text-white py-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <Plus size={20} className="me-2" />
                    {isEditing ? "Edit Exam Schedule" : "Add New Exam Schedule"}
                  </h5>
                </div> */}
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <Plus size={20} className="me-2" />
                    {isEditing ? "Edit Exam Schedule" : "Add New Exam Schedule"}
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div>
                    <div className="row g-3">
                      {columns.map((col) =>
                        col.type === "select" ? (
                          <div className="col-sm-6" key={col.name}>
                            <Select
                              key={col.name}
                              label={col.label}
                              name={col.name}
                              options={col.options}
                              value={[col.name]}
                              onChange={handleInputChange}
                              required={col.required}
                              error=""
                            />
                          </div>
                        ) : (
                          <div className="col-sm-6" key={col.name}>
                            <Input
                              label={col.label}
                              name={col.name}
                              type={col.type || "text"}
                              value={[col.name]}
                              onChange={handleInputChange}
                              required={col.required}
                              error=""
                              pattern={col.pattern}
                            />
                          </div>
                        )
                      )}
{/* 
                       <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Exam Name
                        </label>
                        <select
                          name="examName"
                          value={currentSchedule.examName}
                          onChange={handleInputChange}
                          className="form-select form-select-lg"
                          required
                        >
                          <option value="">Select Exam Type</option>
                          {examTypes.map((exam) => (
                            <option key={exam} value={exam}>
                              {exam}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <Users size={16} className="me-2" />
                          Class
                        </label>
                        <select
                          name="className"
                          value={currentSchedule.className}
                          onChange={handleInputChange}
                          className="form-select form-select-lg"
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={currentSchedule.subject}
                          onChange={handleInputChange}
                          className="form-select form-select-lg"
                          required
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={currentSchedule.date}
                          onChange={handleInputChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <Clock size={16} className="me-2" />
                          Time
                        </label>
                        <input
                          type="time"
                          name="time"
                          value={currentSchedule.time}
                          onChange={handleInputChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Duration (hours)
                        </label>
                        <input
                          type="number"
                          name="duration"
                          value={currentSchedule.duration}
                          onChange={handleInputChange}
                          className="form-control form-control-lg"
                          placeholder="3"
                          min="1"
                          max="8"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Venue</label>
                        <input
                          type="text"
                          name="venue"
                          value={currentSchedule.venue}
                          onChange={handleInputChange}
                          className="form-control form-control-lg"
                          placeholder="Room A-101"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Invigilator
                        </label>
                        <input
                          type="text"
                          name="invigilator"
                          value={currentSchedule.invigilator}
                          onChange={handleInputChange}
                          className="form-control form-control-lg"
                          placeholder="Teacher Name"
                          required
                        />
                      </div> */}

                      <div className="col-12 pt-2">
                        <button
                          onClick={handleSubmit}
                          className="btn btn-primary"
                        >
                          {isEditing ? "Update Schedule" : "Add Schedule"}
                        </button>
                        {isEditing && (
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setCurrentSchedule({
                                id: null,
                                examName: "",
                                className: "",
                                subject: "",
                                date: "",
                                time: "",
                                duration: "",
                                venue: "",
                                invigilator: "",
                              });
                            }}
                            className="btn btn-primary"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule List Section */}
            <div className="col-12 col-md-7">
              <div className="card border-0 shadow-sm h-100">
                {/* <div className="card-header bg-success text-white py-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <Calendar size={20} className="me-2" />
                    Exam Schedules ({examSchedules.length})
                  </h5>
                </div> */}
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <Calendar size={20} className="me-2" />
                    Exam Schedules ({examSchedules.length})
                  </h5>
                </div>
                <div
                  className="card-body p-0"
                  style={{ maxHeight: "700px", overflowY: "auto" }}
                >
                  {examSchedules.length === 0 ? (
                    <div className="text-center py-5">
                      <Calendar size={60} className="text-muted mb-3" />
                      <h5 className="text-muted">
                        No exam schedules added yet
                      </h5>
                      <p className="text-muted">
                        Add your first exam schedule using the form
                      </p>
                    </div>
                  ) : (
                    <div className="p-4">
                      {Object.entries(groupedSchedules).map(
                        ([className, schedules]) => (
                          <div key={className} className="mb-4">
                            <h6 className="text-primary fw-bold mb-3 pb-2 border-bottom border-primary border-2">
                              <Users size={18} className="me-2" />
                              {className}
                            </h6>
                            <div className="row g-3">
                              {schedules.map((schedule) => (
                                <div key={schedule.id} className="col-6">
                                  <div className="card border-0 shadow-sm hover-shadow transition-all">
                                    <div className="card-body p-3">
                                      <div className="row align-items-center">
                                        <div className="col-md-8">
                                          <h6 className="card-title text-primary mb-1">
                                            {schedule.examName}
                                          </h6>
                                          <p className="card-text mb-1">
                                            <strong>Subject:</strong>{" "}
                                            {schedule.subject}
                                          </p>
                                          <div className="row">
                                            <div className="col-sm-6">
                                              <small className="text-muted">
                                                <Calendar
                                                  size={14}
                                                  className="me-1"
                                                />
                                                {new Date(
                                                  schedule.date
                                                ).toLocaleDateString()}
                                              </small>
                                            </div>
                                            <div className="col-sm-6">
                                              <small className="text-muted">
                                                <Clock
                                                  size={14}
                                                  className="me-1"
                                                />
                                                {schedule.time} (
                                                {schedule.duration}h)
                                              </small>
                                            </div>
                                          </div>
                                          <div className="row mt-1">
                                            <div className="col-sm-6">
                                              <small className="text-muted">
                                                <strong>Venue:</strong>{" "}
                                                {schedule.venue}
                                              </small>
                                            </div>
                                            <div className="col-sm-6">
                                              <small className="text-muted">
                                                <strong>Invigilator:</strong>{" "}
                                                {schedule.invigilator}
                                              </small>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-4 text-end">
                                          <button
                                            onClick={() => handleEdit(schedule)}
                                            className="btn btn-outline-primary btn-sm me-2"
                                          >
                                            <Edit3 size={14} />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDelete(schedule.id)
                                            }
                                            className="btn btn-outline-danger btn-sm"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }

        .transition-all {
          transition: all 0.3s ease;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25);
        }

        .btn-primary {
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 0.25rem 0.5rem rgba(79, 70, 229, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ExamScheduleForm;
