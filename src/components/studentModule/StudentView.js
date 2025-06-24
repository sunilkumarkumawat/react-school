import React, { useEffect, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppContext } from '../../context/AppContext';
import { fetchStudentList } from '../../redux/studentListSlice';
import { useNavigate } from 'react-router-dom';
import AppImage from "../../utils/AppImage";
import StatusButton from '../common/StatusButton';
import DataTableWithExport from '../common/DataTableWithExport';
import ActionButton from '../common/ActionButton';
import { handleDeleteRequest, handleStatusChangeRequest } from '../../api/apiHelper';
import { formatDate } from '../../utils/formatDate';
import ImageModal from '../common/ImageModal';

const API_URL = process.env.REACT_APP_BASE_URL || '';

const StudentView = () => {
  const navigate = useNavigate();
  const { token, selectedBranchId } = useContext(AppContext);
  const dispatch = useDispatch();
  const { students, status } = useSelector((state) => state.studentList);
  const [modalImage, setModalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'idle' && students.length === 0) {
      dispatch(fetchStudentList({ API_URL, token, selectedBranchId }));
    }
  }, [dispatch, token, API_URL, status, students.length, selectedBranchId]);

  useEffect(() => {
    dispatch(fetchStudentList({ API_URL, token, selectedBranchId }));
  }, [selectedBranchId]);

  const handleEdit = (student) => {
    navigate(`/studentAdd?id=${student.id}`);
  };

  const handleDelete = async (studentId, modal) => {
    setIsLoading(true);
    try {
      await handleDeleteRequest({
        apiUrl: API_URL,
        ids: studentId,
        modal,
        token,
        confirmMessage: "Are you sure you want to delete this student?",
        onSuccess: () => dispatch(fetchStudentList({ API_URL, token, selectedBranchId })),
        onError: (error) => console.error('Error deleting student:', error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (student) => {
    setIsLoading(true);
    try {
      await handleStatusChangeRequest({
        apiUrl: API_URL,
        ids: student.id,
        modal: 'Student',
        token,
        newStatus: student.status === 'Active' ? 'Inactive' : 'Active',
        confirmMessage: `Are you sure you want to change status for ${student.name}?`,
        onSuccess: () => dispatch(fetchStudentList({ API_URL, token, selectedBranchId })),
        onError: (error) => console.error('Error changing status:', error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      name: 'SR.NO', selector: row => row.srno, cell: (row, rowIndex) => row.srno, width: '70px'
    },
    {
      name: 'Image',
      cell: row => row.image ? (
        <img src={row.image} alt="Student" style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }} onClick={() => setModalImage(row.image)} />
      ) : (
        <AppImage category="png" name="defaultstudent" alt="Student" width={40} height={40} style={{ cursor: 'pointer' }} onClick={() => setModalImage(null)} />
      ),
      center: true,
      width: '70px'
    },
    { name: 'Branch', selector: row => row.branch_id === '-1' ? 'All Branches' : (row.branch_name || '') },
    { name: 'Name', selector: row => row.name },
    { name: 'Enrollment No.', selector: row => row.enrollment_no },
    { name: 'Mobile', selector: row => row.mobile, width: '150px' },
    { name: 'E-Mail', selector: row => row.email },
    { name: 'Gender', selector: row => row.gender },
    {
      name: 'DOB',
      selector: row => row.dob ? formatDate(row.dob, "DD-MM-YYYY") : '-'
    },

    {
      name: 'Status',
      cell: row => (
        <StatusButton
          className={`${row.status === 'Active' ? 'text-success' : 'text-secondary'}`}
          onClick={() => handleStatusChange(row)}
        >
          {row.status === 'Active' ? 'toggle_on' : 'toggle_off'}
        </StatusButton>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <ActionButton className="text-warning mr-1" onClick={() => handleEdit(row)}>Edit</ActionButton>
          <ActionButton className="text-danger" onClick={() => handleDelete(row.id, 'Student')}>Delete</ActionButton>
        </>
      ),
    },
  ];

  const csvHeaders = [
    { label: "SR.NO", key: "srno" },
    { label: "Name", key: "name" },
    { label: "Enrollment No.", key: "enrollment_no" },
    { label: "Mobile", key: "mobile" },
    { label: "E-Mail", key: "email" },
    { label: "Gender", key: "gender" },
    { label: "DOB", key: "dob" },
    { label: "Status", key: "status" }
  ];

  // ✅ FIX: Convert numeric status to string
  const exportMap = (student, idx) => ({
    srno: idx + 1,
    ...student,
    dob: formatDate(student.dob, "DD-MM-YYYY"),
    status: student.status === 1 || student.status === '1' ? 'Active' : 'Inactive'
  });

  const studentsWithSrNo = students.map(exportMap);

  return (
    <div className="">
      <ImageModal show={!!modalImage} imageUrl={modalImage} onClose={() => setModalImage(null)} />
      <div className="row">
        <div className="col-md-12 col-12 p-0">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item">StudentView</li>
          </ul>
        </div>
      </div>
      <div className="table-blur-wrapper" style={{ position: "relative" }}>
        {(isLoading || status === 'loading') && (
          <div style={{ position: "absolute", zIndex: 2, top: 0, left: 0, width: "100%", height: "100%", backdropFilter: "blur(1.5px)", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>
          </div>
        )}
        <div style={{ filter: (isLoading || status === 'loading') ? "blur(3px)" : "none", pointerEvents: (isLoading || status === 'loading') ? "none" : "auto" }}>
          <DataTableWithExport
            columns={columns}
            data={studentsWithSrNo}
            csvFileName="students.csv"
            excelFileName="students.xlsx"
            pdfFileName="students.pdf"
            searchPlaceholder="Search by name, email, enrollment, mobile"
            exportHeaders={csvHeaders}
            exportMap={exportMap}
            paginationRowsPerPageOptions={[10, 50, 300, 500, 1000]}
            defaultRowsPerPage={10}
            title="Student List"
            apiUrl={API_URL}
            modal="Student"
            token={token}
            onBulkDeleteSuccess={() => dispatch(fetchStudentList({ API_URL, token }))}
            onBulkDeleteError={error => console.error('Error deleting students:', error)}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentView;
