import React, { useContext } from "react";
import { AppContext } from '../context/AppContext';

const ProfileDropdown = () => {
  const { user, logout } = useContext(AppContext);

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-light d-flex align-items-center dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ fontSize: "0.875rem" }} // small font
      >
        <i className="bi bi-person-circle me-2"></i>
        <span className="d-none d-md-inline">{user?.name}</span>
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end shadow"
        style={{ minWidth: "100%", width: "max-content", fontSize: "0.875rem" }}
      >
        
        <li className="bg-success"><a className="dropdown-item text-white" href="#">Role: {user?.role_name}</a></li>
        <li><hr className="dropdown-divider" /></li>
        <li><a className="dropdown-item" href="#">Settings</a></li>
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
