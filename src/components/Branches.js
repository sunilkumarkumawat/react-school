import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../context/AppContext";
import Cookies from 'js-cookie';
import { fetchBranches } from "../redux/branchSlice";
import { useDispatch } from "react-redux";
import RoleForm from './RoleForm';
import "../css/modalSidebar.css";
import { deleteItem } from '../api/apiHelper';

const Branches = () => {
  const {
    user,
    token,
    branches,
    showToastr,
    branchStatus,
    branchError,
    selectedBranchId,
    setSelectedBranchId,
  } = useContext(AppContext);
  const dispatch = useDispatch();
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedBranchId = Cookies.get("selectedBranchId");
    if (savedBranchId && (savedBranchId === "-1" || branches.find(branch => branch.id == savedBranchId))) {
      setSelectedBranchId(savedBranchId);

    } else if (branches.length > 0) {
      const firstBranchId = branches[0]['id'];
      setSelectedBranchId(firstBranchId);
      Cookies.set("selectedBranchId", firstBranchId);
    }
  }, [branches]);


  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDispatchBranch = () => {
    dispatch(fetchBranches(user));
    setEditData([])
  };

  const handleBranchSelect = (id) => {
    setSelectedBranchId(id);
    Cookies.set("selectedBranchId", id);
  };

  const [editData, setEditData] = useState([]);
  const handleBranchEdit = (id) => {
    const data = branches.find(branch => branch.id == id)
    setEditData(data)
    setIsModalOpen(true);
  };



  const handleDelete = async (id) => {
    const result = await deleteItem({
      modelName: "Branch",
      id: id,
      token: token
    });


    if (result.status) {
      showToastr(`${result.message}`, {
        position: 'center',
        duration: 3000,
      });
      handleDispatchBranch();
    } else {
      showToastr(`Delete failed: ${result.message}`, {
        position: 'center',
        duration: 3000,
      });
    }
  };
  return (
    <div className="d-flex align-items-center gap-2" style={{ marginTop: '14px' }}>

      <div className="dropdown">
        <a
          href="#"
          className="btn bg-gradient-dark dropdown-toggle d-flex align-items-center gap-2"
          data-bs-toggle="dropdown"
          style={{ minWidth: "220px" }}
        >
          <i className="material-symbols-rounded opacity-5">network_node</i>

          {selectedBranchId === "-1"
            ? "All Branches"
            : (branches.find(branch => String(branch.id) === String(selectedBranchId))?.name || 'Select Branch')}
        </a>

        <ul className="dropdown-menu shadow" style={{ minWidth: "220px", fontSize: "0.875rem" }}>
          {user?.role_name === "Admin" && (
            <>
              <li className="d-flex align-items-center justify-content-between px-2 py-1">
                <span
                  onClick={() => handleBranchSelect("-1")}
                  className="dropdown-item flex-grow-1 alignment_text"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="material-symbols-rounded opacity-5">network_node</i>
                  All Branches
                </span>
              </li>
              <li><hr className="dropdown-divider" /></li>
            </>
          )}

          {Object.values(branches).map((branch, idx) => (
            <li key={branch.id} className="d-flex align-items-center justify-content-between px-2 py-1">
              <span
                onClick={() => handleBranchSelect(branch.id)}
                className="dropdown-item flex-grow-1 alignment_text"
                style={{ cursor: 'pointer' }}
              >
                <i className="material-symbols-rounded opacity-5">line_end_circle</i>
                {branch.name}
              </span>
              <div className="d-flex gap-2 me-3">
                <i className="material-symbols-rounded"
                  title="Edit"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleBranchEdit(branch.id)}
                >edit</i>
                <i className="material-symbols-rounded"
                  title="Delete"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(branch.id)}
                >delete</i>
              </div>
            </li>
          ))}

          <li><hr className="dropdown-divider" /></li>
          <li>
            <button
              className="dropdown-item d-flex justify-content-center align-items-center gap-1"
              onClick={() => openModal("createBranch")}
              style={{ cursor: 'pointer' }}
            >
              <i className="material-symbols-rounded">add</i> Add Branch
            </button>
          </li>
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ width: '400px' }} onClick={(e) => e.stopPropagation()}>
            <RoleForm
              roleName={"Branch"}
              role={[]}
              handleDispatch={handleDispatchBranch}
              token={token}
              user={user}
              editData={editData}
            />
          </div>
        </div>
      )}
    </div>

  );
};

export default Branches;
