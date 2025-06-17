import React from "react";

const Roles = ({
  roles,
  selectedRoleId,
  status,
  error,
  handleRoleClick,
  openModal,
  handleRoleEdit,
  handleRoleDelete,
}) => {
  return (
    <div className="mb-3">
      <h6>Select Role</h6>
      {status === "loading" ? (
        <p className="text-muted">Loading roles...</p>
      ) : status === "failed" ? (
        <p className="text-danger">Error loading roles: {error}</p>
      ) : (
        <>
  
          <div className="dropdown" style={{width: 'fit-content'}}>
            <a
              href="#"
              className="btn bg-gradient-dark dropdown-toggle d-flex align-items-center gap-2"
              data-bs-toggle="dropdown"
              
            >
              <i className="material-symbols-rounded opacity-5">network_node</i>

              {selectedRoleId === "-1"
                ? "Select Role"
                : roles.find(
                    (role) => String(role.id) === String(selectedRoleId)
                  )?.name || "Select Role"}
            </a>
            <ul
              className="dropdown-menu shadow"
              style={{ minWidth: "220px", fontSize: "0.875rem" }}
            >
              <li className="d-flex align-items-center justify-content-between px-2 py-1">
                <span
                  onClick={() => handleRoleClick("-1")}
                  className="dropdown-item flex-grow-1 alignment_text"
                  style={{ cursor: "pointer" }}
                >
                  <i className="material-symbols-rounded opacity-5">
                    network_node
                  </i>
                  Select Role
                </span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              {Object.values(roles).map((role) => (
                <li
                  key={role.id}
                  className="d-flex align-items-center justify-content-between px-2 py-1"
                >
                  <span
                    onClick={() => handleRoleClick(role.id)}
                    className="dropdown-item flex-grow-1 alignment_text"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="material-symbols-rounded opacity-5">
                      line_end_circle
                    </i>
                    {role.name}
                  </span>
                  <div className="d-flex gap-2 me-3">
                    <i
                      className="material-symbols-rounded"
                      title="Edit"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRoleEdit(role)}
                    >
                      edit
                    </i>
                    <i
                      className="material-symbols-rounded"
                      title="Delete"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRoleDelete(role.id)}
                    >
                      delete
                    </i>
                  </div>
                </li>
              ))}

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item d-flex justify-content-center align-items-center gap-1"
                  onClick={() => openModal("createRole")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="material-symbols-rounded">add</i> Create Role
                </button>
              </li>
            </ul>
          </div>

          {/* <button
            className="btn btn-sm btn-outline-warning mt-3"
            onClick={() => openModal("createRole")}
          >
            + Create Role
          </button> */}
        </>
      )}
    </div>
  );
};

export default Roles;
