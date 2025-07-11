import React, { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";

const SalaryManagementSystem = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  const [salaryData, setSalaryData] = useState({
    name: "",
    basicSalary: "",
    incentive: "",
    incentiveRemark: "",
    otherDeduction: "",
    otherDeductionRemark: "",
    salaryGenerateDate: new Date().toISOString().split("T")[0],
    finalSalary: "",
  });

  const [attendanceData, setAttendanceData] = useState({
    totalDays: "",
    holiday: "",
    absent: "",
    halfDay: "",
    doubleShift: "",
    working: "",
    lateCome: "",
    lateComeFrequency: "",
    salaryDays: "",
  });

  const [salaryRecords, setSalaryRecords] = useState([
    {
      id: 1,
      name: "Shakti Singh",
      role: "Teacher",
      month: "January",
      basicSalary: 25000,
      incentive: 2000,
      otherDeduction: 500,
      finalSalary: 26500,
      salaryGenerateDate: "2025-01-15",
      attendance: {
        totalDays: 31,
        working: 29,
        absent: 2,
        halfDay: 0,
        salaryDays: 29,
      },
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Principal",
      month: "January",
      basicSalary: 45000,
      incentive: 5000,
      otherDeduction: 1000,
      finalSalary: 49000,
      salaryGenerateDate: "2025-01-15",
      attendance: {
        totalDays: 31,
        working: 31,
        absent: 0,
        halfDay: 0,
        salaryDays: 31,
      },
    },
    {
      id: 3,
      name: "Rahul Kumar",
      role: "Coordinator",
      month: "December",
      basicSalary: 35000,
      incentive: 3000,
      otherDeduction: 0,
      finalSalary: 38000,
      salaryGenerateDate: "2024-12-30",
      attendance: {
        totalDays: 31,
        working: 28,
        absent: 1,
        halfDay: 2,
        salaryDays: 28,
      },
    },
  ]);

  // Sample data
  const roles = [
    { id: "teacher", name: "Teacher", baseSalary: 25000 },
    { id: "principal", name: "Principal", baseSalary: 45000 },
    { id: "coordinator", name: "Coordinator", baseSalary: 35000 },
    { id: "clerk", name: "Clerk", baseSalary: 20000 },
    { id: "librarian", name: "Librarian", baseSalary: 22000 },
    { id: "counselor", name: "Counselor", baseSalary: 30000 },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const staff = [
    { id: "shakti", name: "Shakti Singh", experience: 5 },
    { id: "priya", name: "Priya Sharma", experience: 3 },
    { id: "rahul", name: "Rahul Kumar", experience: 7 },
    { id: "anjali", name: "Anjali Gupta", experience: 4 },
    { id: "suresh", name: "Suresh Patel", experience: 6 },
    { id: "maya", name: "Maya Verma", experience: 2 },
  ];

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);

    if (roleId) {
      const role = roles.find((r) => r.id === roleId);
      setSalaryData((prev) => ({
        ...prev,
        basicSalary: role.baseSalary.toString(),
      }));
    } else {
      setSalaryData((prev) => ({
        ...prev,
        basicSalary: "",
      }));
    }
  };

  const handleStaffChange = (e) => {
    const staffId = e.target.value;
    setSelectedStaff(staffId);

    if (staffId) {
      const staffMember = staff.find((s) => s.id === staffId);
      setSalaryData((prev) => ({
        ...prev,
        name: staffMember.name,
      }));
    } else {
      setSalaryData((prev) => ({
        ...prev,
        name: "",
      }));
    }
  };

  const filterColumns = [
    {
      label: "Select Role",
      name: "role",
      required: true,
      value: selectedRole,
      type: "select",
      onChange: handleRoleChange,
      options: roles.map((role) => ({
        value: role.id,
        label: role.name,
      })),
    },
    {
      label: "Salary Month",
      name: "month",
      required: true,
      value: selectedMonth,
      type: "select",
      onChange: (e) => setSelectedMonth(e.target.value),
      options: months.map((month) => ({
        value: month,
        label: month,
      })),
    },
    {
      label: "Select Staff",
      name: "staff",
      required: true,
      value: selectedStaff,
      type: "select",
      onChange: handleStaffChange,
      options: staff.map((staff) => ({
        value: staff.id,
        label: staff.name,
      })),
    },
  ];

  const calculateFinalSalary = () => {
    const basic = parseFloat(salaryData.basicSalary) || 0;
    const incentive = parseFloat(salaryData.incentive) || 0;
    const deduction = parseFloat(salaryData.otherDeduction) || 0;
    const final = basic + incentive - deduction;

    setSalaryData((prev) => ({
      ...prev,
      finalSalary: final.toString(),
    }));
  };

  const handleSalaryInputChange = (field, value) => {
    setSalaryData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (
      field === "basicSalary" ||
      field === "incentive" ||
      field === "otherDeduction"
    ) {
      setTimeout(calculateFinalSalary, 100);
    }
  };

  const handleAttendanceInputChange = (field, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "totalDays" || field === "absent" || field === "halfDay") {
      const totalDays =
        parseFloat(field === "totalDays" ? value : attendanceData.totalDays) ||
        0;
      const absent =
        parseFloat(field === "absent" ? value : attendanceData.absent) || 0;
      const halfDay =
        parseFloat(field === "halfDay" ? value : attendanceData.halfDay) || 0;
      const salaryDays = totalDays - absent - halfDay * 0.5;

      setAttendanceData((prev) => ({
        ...prev,
        salaryDays: salaryDays.toString(),
      }));
    }
  };

  const generateSalary = () => {
    if (!selectedRole || !selectedMonth || !selectedStaff) {
      alert("Please select all required fields");
      return;
    }

    const newRecord = {
      id: salaryRecords.length + 1,
      name: salaryData.name,
      role: roles.find((r) => r.id === selectedRole)?.name,
      month: selectedMonth,
      basicSalary: parseFloat(salaryData.basicSalary) || 0,
      incentive: parseFloat(salaryData.incentive) || 0,
      otherDeduction: parseFloat(salaryData.otherDeduction) || 0,
      finalSalary: parseFloat(salaryData.finalSalary) || 0,
      salaryGenerateDate: salaryData.salaryGenerateDate,
      attendance: {
        totalDays: parseFloat(attendanceData.totalDays) || 0,
        working: parseFloat(attendanceData.working) || 0,
        absent: parseFloat(attendanceData.absent) || 0,
        halfDay: parseFloat(attendanceData.halfDay) || 0,
        salaryDays: parseFloat(attendanceData.salaryDays) || 0,
      },
    };

    setSalaryRecords((prev) => [...prev, newRecord]);
    alert("Salary generated successfully!");

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setSelectedRole("");
    setSelectedMonth("");
    setSelectedStaff("");
    setSalaryData({
      name: "",
      basicSalary: "",
      incentive: "",
      incentiveRemark: "",
      otherDeduction: "",
      otherDeductionRemark: "",
      salaryGenerateDate: new Date().toISOString().split("T")[0],
      finalSalary: "",
    });
    setAttendanceData({
      totalDays: "",
      holiday: "",
      absent: "",
      halfDay: "",
      doubleShift: "",
      working: "",
      lateCome: "",
      lateComeFrequency: "",
      salaryDays: "",
    });
  };

  const deleteRecord = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setSalaryRecords((prev) => prev.filter((record) => record.id !== id));
    }
  };

  return (
    <div
      className="container-fluid p-3"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-primary">
            <div className="card-body py-2">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="text-white mb-0">
                  <i className="fas fa-dollar-sign me-2"></i> Salary Panel
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Row - Only show in Add mode */}

      <div className="row mb-4">
        {filterColumns.map((col) =>
          col.type === "select" ? (
            <div className="col-sm-2" key={col.name}>
              <Select
                key={col.name}
                label={col.label}
                name={col.name}
                options={col.options}
                value={[col.value]}
                onChange={col.onChange}
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
      </div>

      {/* Main Content Row */}
      <div className="row">
        {/* Add Panel */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary">
              <h5 className="text-white mb-0">
                <i className="fas fa-plus me-2"></i> Add Salary
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-danger fw-bold">
                      Name*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={salaryData.name}
                      onChange={(e) =>
                        handleSalaryInputChange("name", e.target.value)
                      }
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Incentive</label>
                    <input
                      type="number"
                      className="form-control"
                      value={salaryData.incentive}
                      onChange={(e) =>
                        handleSalaryInputChange("incentive", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Incentive Remark</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={salaryData.incentiveRemark}
                      onChange={(e) =>
                        handleSalaryInputChange(
                          "incentiveRemark",
                          e.target.value
                        )
                      }
                      placeholder="Incentive Remark"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-danger fw-bold">
                      Salary Generate Date*
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={salaryData.salaryGenerateDate}
                      onChange={(e) =>
                        handleSalaryInputChange(
                          "salaryGenerateDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-danger fw-bold">
                      Basic Salary*
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={salaryData.basicSalary}
                      onChange={(e) =>
                        handleSalaryInputChange("basicSalary", e.target.value)
                      }
                      placeholder="25000"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Other Deduction</label>
                    <input
                      type="number"
                      className="form-control"
                      value={salaryData.otherDeduction}
                      onChange={(e) =>
                        handleSalaryInputChange(
                          "otherDeduction",
                          e.target.value
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Other Deduction Remark</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={salaryData.otherDeductionRemark}
                      onChange={(e) =>
                        handleSalaryInputChange(
                          "otherDeductionRemark",
                          e.target.value
                        )
                      }
                      placeholder="Deduction Remark"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-danger fw-bold">
                      Final Salary*
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={salaryData.finalSalary}
                      onChange={(e) =>
                        handleSalaryInputChange("finalSalary", e.target.value)
                      }
                      placeholder="25000"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold">Total Days</label>
                    <input
                      type="number"
                      className="form-control"
                      value={attendanceData.totalDays}
                      onChange={(e) =>
                        handleAttendanceInputChange("totalDays", e.target.value)
                      }
                      placeholder="31"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold">Holiday</label>
                    <input
                      type="number"
                      className="form-control"
                      value={attendanceData.holiday}
                      onChange={(e) =>
                        handleAttendanceInputChange("holiday", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold">Absent</label>
                    <input
                      type="number"
                      className="form-control"
                      value={attendanceData.absent}
                      onChange={(e) =>
                        handleAttendanceInputChange("absent", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold">Half Day</label>
                    <input
                      type="number"
                      className="form-control"
                      value={attendanceData.halfDay}
                      onChange={(e) =>
                        handleAttendanceInputChange("halfDay", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold">Double Shift</label>
                    <input
                      type="number"
                      className="form-control"
                      value={attendanceData.doubleShift}
                      onChange={(e) =>
                        handleAttendanceInputChange(
                          "doubleShift",
                          e.target.value
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold">Working</label>
                    <input
                      type="number"
                      className="form-control"
                      value={attendanceData.working}
                      onChange={(e) =>
                        handleAttendanceInputChange("working", e.target.value)
                      }
                      placeholder="31"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold">Late Come</label>
                    <input
                      type="number"
                      className="form-control"
                      value={attendanceData.lateCome}
                      onChange={(e) =>
                        handleAttendanceInputChange("lateCome", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold">
                      Late Come Frequency
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={attendanceData.lateComeFrequency}
                      onChange={(e) =>
                        handleAttendanceInputChange(
                          "lateComeFrequency",
                          e.target.value
                        )
                      }
                      placeholder="3"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Salary Days</label>
                  <input
                    type="number"
                    className="form-control"
                    value={attendanceData.salaryDays}
                    onChange={(e) =>
                      handleAttendanceInputChange("salaryDays", e.target.value)
                    }
                    placeholder="31"
                  />
                </div>
              </div>
              <div className="text-center">
                <button className="btn btn-primary" onClick={generateSalary}>
                  Generate
                </button>
                <button className="btn btn-secondary" onClick={resetForm}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Panel */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary">
              <h5 className="text-white mb-0">
                <i className="fas fa-eye me-2"></i> Salary Records
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="bg-primary">
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Month</th>
                      <th>Basic Salary</th>
                      <th>Final Salary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.name}</td>
                        <td>{record.role}</td>
                        <td>{record.month}</td>
                        <td>₹{record.basicSalary.toLocaleString()}</td>
                        <td>
                          <span className="badge bg-success">
                            ₹{record.finalSalary.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteRecord(record.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryManagementSystem;
