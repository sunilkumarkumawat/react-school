import React, { useState, useEffect } from "react";
import "../../css/AssignPermission.css"; // Custom checkbox style

const permissionTypes = ['add', 'edit', 'view', 'delete', 'status', 'approve', 'export', 'print'];

const AssignPermission = ({ sidebarMenu = [], roleId = null, initialPermissions = [],  handlePermissionChange }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  useEffect(() => {
    if (Array.isArray(initialPermissions)) {
      setSelectedPermissions(new Set(initialPermissions));
    }
  }, [initialPermissions]);

  const getPermissionKey = (className, type) => {
    const base = (className || "").split('.')[0]; // prevent crash on undefined
    return `${base}.${type}`;
  };

  const toggleSinglePermission = (key) => {
    setSelectedPermissions((prev) => {
      const updated = new Set(prev);
      if (updated.has(key)) {
        updated.delete(key);
      } else {
        updated.add(key);
      }
      return updated;
    });
  };

  const isChecked = (key) => selectedPermissions.has(key);

  const isTypeChecked = (type) =>
    sidebarMenu.every((item) =>
      selectedPermissions.has(getPermissionKey(item.className, type))
    );

  const toggleColumnPermissions = (type) => {
    const allChecked = isTypeChecked(type);
    setSelectedPermissions((prev) => {
      const updated = new Set(prev);
      sidebarMenu.forEach((item) => {
        const key = getPermissionKey(item.className, type);
        allChecked ? updated.delete(key) : updated.add(key);
      });
      return updated;
    });
  };

const [isReady, setIsReady] = useState(false);

useEffect(() => {
  if (Array.from(selectedPermissions).length > 0) {
    handlePermissionChange(Array.from(selectedPermissions));
  }
}, [selectedPermissions]);
  return (
    <div className="row">
      <div className="col-md-12 col-12">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Module</th>
                {permissionTypes.map((type) => (
                  <th key={type}>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={isTypeChecked(type)}
                        onChange={() => toggleColumnPermissions(type)}
                      />
                      <span className="checkmark"></span>
                      <span className="ms-1">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sidebarMenu.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  {permissionTypes.map((type) => {
                    const key = getPermissionKey(item.className, type);
                    return (
                      <td key={type}>
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            checked={isChecked(key)}
                            onChange={() => toggleSinglePermission(key)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* <div className="mt-3">
            <strong>Selected Permissions:</strong>
            <div>{Array.from(selectedPermissions).join(', ') || "None selected"}</div>
          </div> */}

     
      </div>
    </div>
  );
};

export default AssignPermission;
