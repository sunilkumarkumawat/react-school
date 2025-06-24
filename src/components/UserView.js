import React, { useEffect, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ActionButton from './common/ActionButton';
import { AppContext } from '../context/AppContext';
import { fetchUsersList } from '../redux/usersListSlice';
import { useNavigate } from "react-router-dom";
import AppImage from "../utils/AppImage";
import StatusButton from './common/StatusButton';
import { formatDate } from '../utils/formatDate';
import DataTableWithExport from './common/DataTableWithExport';
import { handleDeleteRequest, handleStatusChangeRequest } from '../api/apiHelper';
import ImageModal from './common/ImageModal';
const API_URL = process.env.REACT_APP_BASE_URL || '';

const UserView = () => {
  const navigate = useNavigate();
  const { token, selectedBranchId } = useContext(AppContext);
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.usersList);
  const [modalImage, setModalImage] = useState(null);
  useEffect(() => {
    if (status === 'idle' && users.length === 0) {
      dispatch(fetchUsersList({ API_URL, token, selectedBranchId }));
    }
  }, [dispatch, token, API_URL, status, users.length, selectedBranchId]);
  useEffect(() => {

    dispatch(fetchUsersList({ API_URL, token, selectedBranchId }));

  }, [selectedBranchId]);

  const handleEdit = (user) => {
    navigate(`/userAdd?id=${user.id}`);
  };



  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (userId, modal) => {
    setIsLoading(true);
    try {
      await handleDeleteRequest({
        apiUrl: API_URL,
        ids: userId, // <-- pass as 'ids', not 'id'
        modal,
        token,
        confirmMessage: "Are you sure you want to delete this user?",
        onSuccess: () => dispatch(fetchUsersList({ API_URL, token, selectedBranchId })),
        onError: (error) => console.error('Error deleting user:', error)
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleStatusChange = async (user) => {
    setIsLoading(true);
    try {
      await handleStatusChangeRequest({
        apiUrl: API_URL,
        ids: user.id,
        modal: 'User',
        token,
        newStatus: user.status === 'Active' ? 'Inactive' : 'Active',
        confirmMessage: `Are you sure you want to change status for ${user.name}?`,
        onSuccess: () => dispatch(fetchUsersList({ API_URL, token, selectedBranchId })),
        onError: (error) => console.error('Error changing status:', error)
      });
    } finally {
      setIsLoading(false);
    }
  };



  // Columns for DataTable
  const columns = [
    {
      name: 'SR.NO',
      selector: row => row.srno, // <-- Add this line
      cell: (row, rowIndex) => row.srno,
      width: '70px'
    },
    {
      name: 'Image',
      cell: row =>
        row.image ? (
          <img
            src={row.image}
            alt="User"
            style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
            onClick={() => setModalImage(row.image)}
          />
        ) : (
          <AppImage
            category="png"
            name="defaultUser"
            alt="User"
            width={40}
            height={40}
            style={{ cursor: 'pointer' }}
            onClick={() => setModalImage(null)}
          />
        ),
      center: true,
      width: '70px'
    },
    { name: 'Role', selector: row => row.role_name || '' },
    {
      name: 'Branch',
      selector: row =>
        row.branch_id == '-1'
          ? 'All Branches'
          : (row.branch_name || ''),
    },
    { name: 'Name', selector: row => row.name },
    { name: 'Mobile', selector: row => row.mobile, width: '150px' },
    { name: 'E-Mail', selector: row => row.email },
    { name: 'Gender', selector: row => row.gender },
    {
      name: 'DOB',
      selector: row => formatDate(row.dob, "DD-MM-YYYY"),
    },
    {
      name: 'Status',
      cell: row =>
        row.role_id === 1 ? (
          <span className="text-danger" style={{ fontSize: '10px' }} >Status Locked</span>
        ) : (
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
      cell: row =>
        row.role_id === 1 ? (
          <span className="text-danger" style={{ fontSize: '10px' }}>Action Locked</span>
        ) : (
          <>
            <ActionButton
              className="text-warning mr-1"
              onClick={() => handleEdit(row)}
            >
              Edit
            </ActionButton>
            <ActionButton
              className="text-danger"
              onClick={() => handleDelete(row.id, 'User')}
            >
              Delete
            </ActionButton>
          </>
        ),
    },
  ];

  // CSV headers for export
  const csvHeaders = [
    { label: "SR.NO", key: "srno" },
    { label: "Name", key: "name" },
    { label: "Role", key: "role_name" },
    { label: "Mobile", key: "mobile" },
    { label: "E-Mail", key: "email" },
    { label: "Gender", key: "gender" },
    { label: "DOB", key: "dob" },
    { label: "Status", key: "status" }
  ];

  // Map user data for export and table
  const exportMap = (user, idx) => ({
    srno: idx + 1,
    ...user,
    gender: user.gender,
    dob: formatDate(user.dob, "DD-MM-YYYY"),
    status: user.status === '1' ? 'Active' : 'Inactive'
  });

  const usersWithSrNo = users.map(exportMap);

  return (
    <div className="">
      <ImageModal
        show={!!modalImage}
        imageUrl={modalImage}
        onClose={() => setModalImage(null)}
      />
      <div className="row">
        <div className="col-md-12 col-12 p-0">
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard">Dashboard </a>
            </li>
            <li className="breadcrumb-item">UserView</li>
          </ul>
        </div>
      </div>
      <div className="table-blur-wrapper" style={{ position: "relative" }}>
        {(isLoading || status === 'loading') && (
          <div
            style={{
              position: "absolute",
              zIndex: 2,
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backdropFilter: "blur(1.5px)", // <-- lighter blur
              background: "rgba(255,255,255,0.15)", // <-- lighter overlay
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <div style={{ filter: (isLoading || status === 'loading') ? "blur(3px)" : "none", pointerEvents: (isLoading || status === 'loading') ? "none" : "auto" }}>
          <DataTableWithExport
            columns={columns}
            data={usersWithSrNo}
            csvFileName="users.csv"
            excelFileName="users.xlsx"
            pdfFileName="users.pdf"
            searchPlaceholder="Search by name, email, mobile, role"
            exportHeaders={csvHeaders}
            exportMap={exportMap}
            paginationRowsPerPageOptions={[10, 50, 300, 500, 1000]}
            defaultRowsPerPage={10}
            title="User List"
            apiUrl={API_URL}
            modal="User"
            token={token}
            onBulkDeleteSuccess={() => dispatch(fetchUsersList({ API_URL, token }))}
            onBulkDeleteError={error => console.error('Error deleting users:', error)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserView;