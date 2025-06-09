import React, { useEffect, useState } from "react";
import { fetchUsersByRole } from "../api/apiHelper";


const List = ({ roleId,branchId, adminId,roles, columns ,filters={}}) => {

    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {

              const rowData = {branch_id:branchId,role_id:roleId,admin_id:adminId,filters:filters}
                const data = await fetchUsersByRole(rowData);


                if (data.error) {
                    setError(data.error);
                } else {
                    setUsers(data);
                }
            } catch (err) {
                setError("Something went wrong. Please try again later.");
            }
            setLoading(false);
        };

        loadUsers();
    }, [roleId,branchId,filters]);

    const filteredUsers = users.filter(user =>
        Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

  return (
    <div className="row">
      <div className="col-12">
        <div className="card my-4">
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
              <h6 className="text-white text-capitalize ps-3">
                List of all {roles.find(role => String(role.id) === String(roleId))?.name}s
              </h6>
            </div>
          </div>
          <div className="card-body px-0 pb-2">
            <div className="table-responsive p-0">
              {/* <input
                type="text"
                className="form-control mb-3"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              /> */}

              {loading ? (
                <h6 className='text-center opacity-7'>Loading...</h6>
              ) : error ? (
                <h6 className="text-danger text-center opacity-7">{error}</h6>
              ) : (
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">#</th>
                      {columns.map((col, index) => (
                        <th key={index}>{col.key == 'admin_id' ?
                           'Admin' : col.key == 'branch_id' ?
                            'Branch' : col.key == 'role_id' ?
                             'Role' : col.label}
                             </th>
                      ))}
                      <th className="text-secondary opacity-7">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="justify-content-center">
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          {columns.map((col, colIndex) => (
                            <td key={colIndex}>
                              {col.render ? col.render(user[col.key], user) : user[col.key]}
                            </td>
                          ))}
                          <td>
                            <button className="btn btn-primary btn-sm me-2">Edit</button>
                            <button className="btn btn-danger btn-sm">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length + 2} className="text-center">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
);

};

export default List;
