import React, { useState } from 'react';
import { ChevronLeft, BookOpen, Users, Save, Trash2, Edit3, Plus } from 'lucide-react';

const AssignSubject = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [showSubjects, setShowSubjects] = useState(false);

  // Sample data
  const classes = [
    { id: '1st', name: '1st Class' },
    { id: '2nd', name: '2nd Class' },
    { id: '3rd', name: '3rd Class' },
    { id: '4th', name: '4th Class' },
    { id: '5th', name: '5th Class' },
    { id: '6th', name: '6th Class' },
    { id: '7th', name: '7th Class' },
    { id: '8th', name: '8th Class' },
    { id: '9th', name: '9th Class' },
    { id: '10th', name: '10th Class' }
  ];

  const subjectsData = {
    '1st': [
      { id: 1, name: 'Hindi', category: 'Main' },
      { id: 2, name: 'English', category: 'Main' },
      { id: 3, name: 'Maths', category: 'Main' },
      { id: 4, name: 'EVS', category: 'Main' },
      { id: 5, name: 'Drawing', category: 'Other' },
      { id: 6, name: 'Music', category: 'Other' }
    ],
    '2nd': [
      { id: 1, name: 'Hindi', category: 'Main' },
      { id: 2, name: 'English', category: 'Main' },
      { id: 3, name: 'Maths', category: 'Main' },
      { id: 4, name: 'Science', category: 'Main' },
      { id: 5, name: 'Social Studies', category: 'Main' },
      { id: 6, name: 'Computer', category: 'Other' },
      { id: 7, name: 'Art', category: 'Other' }
    ],
    '3rd': [
      { id: 1, name: 'Hindi', category: 'Main' },
      { id: 2, name: 'English', category: 'Main' },
      { id: 3, name: 'Maths', category: 'Main' },
      { id: 4, name: 'Science', category: 'Main' },
      { id: 5, name: 'Social Studies', category: 'Main' },
      { id: 6, name: 'Computer', category: 'Other' }
    ]
  };

  const handleClassSelect = () => {
    if (selectedClass) {
      setShowSubjects(true);
      setSelectedSubjects([]);
    }
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => {
      const isSelected = prev.find(s => s.id === subject.id);
      if (isSelected) {
        return prev.filter(s => s.id !== subject.id);
      } else {
        return [...prev, subject];
      }
    });
  };

  const handleSave = () => {
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject');
      return;
    }

    const newAssignments = selectedSubjects.map((subject, index) => ({
      id: Date.now() + index,
      subject: subject.name,
      category: subject.category,
      class: selectedClass,
      sort: index + 1
    }));

    setAssignedSubjects(prev => [...prev, ...newAssignments]);
    setSelectedSubjects([]);
    setShowSubjects(false);
    setSelectedClass('');
  };

  const handleDelete = (id) => {
    setAssignedSubjects(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="card card-orange card-outline">
        <div className="card-header bg-light">
          <div className="card-title">
            <h4><i class="fa-solid fa-book-open"></i> &nbsp;Assign Subject</h4>
          </div>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-4'>
              <div className='card card-orange card-outline'>
                <div className='card-header bg-light'>
                  <div className='card-title'>
                    <h4>Class</h4>
                  </div>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='col-md-12'>
                      <label className='form-label'>Select Class</label>
                      <select
                        className="form-control"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">Choose a class...</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className='col-md-8'>
              <div className='card card-orange card-outline'>
                <div className='card-header bg-light'>
                  <div className='card-title'>
                    <h4>Select Subject</h4>
                  </div>
                </div>
                <div className='card-body'>
            
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="container py-4">
      
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-end">
                  <div className="col-md-8">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <Users size={18} className="me-2" />
                      Select Class
                    </label>
                    <select
                      className="form-control"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="">Choose a class...</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <button
                      className="btn btn-primary btn-lg w-100"
                      onClick={handleClassSelect}
                      disabled={!selectedClass}
                    >
                      <Plus size={18} className="me-2" />
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Selection Section */}
        {/* {showSubjects && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pb-0">
                  <h5 className="mb-3 text-primary fw-bold">
                    <BookOpen size={20} className="me-2" />
                    Select Subjects for {selectedClass} Class
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {subjectsData[selectedClass]?.map(subject => (
                      <div key={subject.id} className="col-md-6 col-lg-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`subject-${subject.id}`}
                            checked={selectedSubjects.find(s => s.id === subject.id) !== undefined}
                            onChange={() => handleSubjectToggle(subject)}
                          />
                          <label className="form-check-label w-100" htmlFor={`subject-${subject.id}`}>
                            <div className="d-flex justify-content-between align-items-center p-2 border rounded hover-card">
                              <span className="fw-medium">{subject.name}</span>
                              <span className={`badge ${subject.category === 'Main' ? 'bg-primary' : 'bg-secondary'}`}>
                                {subject.category}
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-4">
                    <button
                      className="btn btn-success btn-lg px-5"
                      onClick={handleSave}
                      disabled={selectedSubjects.length === 0}
                    >
                      <Save size={18} className="me-2" />
                      Save Selected Subjects
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Assigned Subjects Table */}
        {/* {assignedSubjects.length > 0 && (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0 text-primary fw-bold">
                    <Edit3 size={20} className="me-2" />
                    Assigned Subjects
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th className="fw-semibold">Sr.No.</th>
                          <th className="fw-semibold">Subject</th>
                          <th className="fw-semibold">Sort Order</th>
                          <th className="fw-semibold">Category</th>
                          <th className="fw-semibold">Class</th>
                          <th className="fw-semibold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedSubjects.map((item, index) => (
                          <tr key={item.id} className="align-middle">
                            <td className="fw-medium">{index + 1}</td>
                            <td className="fw-medium text-primary">{item.subject}</td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {item.sort}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${item.category === 'Main' ? 'bg-primary' : 'bg-secondary'}`}>
                                {item.category}
                              </span>
                            </td>
                            <td className="fw-medium">{item.class}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(item.id)}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 text-center">
                  <button className="btn btn-primary btn-lg px-5">
                    <Save size={18} className="me-2" />
                    Submit All Assignments
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Empty State */}
        {/* {assignedSubjects.length === 0 && !showSubjects && (
          <div className="text-center py-5">
            <BookOpen size={64} className="text-muted mb-3" />
            <h4 className="text-muted mb-2">No Subjects Assigned Yet</h4>
            <p className="text-muted">Select a class and assign subjects to get started</p>
          </div>
        )} */}
      </div>

      {/* <style jsx>{`
        .hover-card:hover {
          background-color: #f8f9fa;
          border-color: #0d6efd !important;
        }
        
        .form-check-input:checked + .form-check-label .hover-card {
          background-color: #e7f3ff;
          border-color: #0d6efd !important;
        }
        
        .table-hover tbody tr:hover {
          background-color: #f8f9fa;
        }
        
        .btn:disabled {
          opacity: 0.6;
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .badge {
          font-size: 0.75em;
        }
      `}</style> */}
    </div>
  );
};

export default AssignSubject;