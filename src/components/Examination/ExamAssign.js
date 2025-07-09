import React, { useState } from "react";
import ActionButton from "../common/ActionButton";

const ExamAssign = ({ setShowModal }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [assignedClasses, setAssignedClasses] = useState([]);

  const classOptions = ["Class 1", "Class 2", "Class 3", "Class 4"];

  const handleAssign = () => {
    if (selectedClass && !assignedClasses.includes(selectedClass)) {
      setAssignedClasses([...assignedClasses, selectedClass]);
      setSelectedClass("");
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
       <div>
         <button onClick={() => setShowModal(false)}>Close</button>
       </div>
        <div className="row">
          {/* class form */}
          <div className="col-md-3">
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fa fa-user-shield"></i>Assign Class to Exam
                </h5>
              </div>
              <div className="card-body">
               
                  <div className="row">
                    <label>Select Class:</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      {classOptions.map((cls, idx) => (
                        <option key={idx} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                    <div className="col-12 mt-2">
                      <button
                        onClick={handleAssign}
                        className="btn btn-primary"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                
              </div>
            </div>
          </div>
          {/* class list */}
          <div className="col-md-9">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fa fa-list"></i> Assigned Classes:
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="bg-light">
                      <tr>
                        <th>Sr. No</th>
                        <th>Class Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedClasses.length > 0 ? (
                        assignedClasses.map((classes, index) => (
                          <tr key={classes.id}>
                            <td>{index + 1}</td>
                            <td>{classes.cls}</td>
                            <td>
                              <ActionButton className="btn btn-sm btn-danger">
                                Delete
                              </ActionButton>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No classes found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 1140px;
        }

        select {
          margin: 10px;
        }

        table {
          width: 100%;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ExamAssign;
