import React, { useState,useContext } from "react";
import { AppContext } from "../context/AppContext";
function Dashboard({ collapsed }) {
   const {
      isSidebarCollapsed,
      toggleSidebar,
      user,
      logout,
      token,
      selectedBranchId,
      setSelectedBranchId,
    } = useContext(AppContext);
  return (
    <div className="row">
<div className="col-12 col-md-12">

  Hello World! This is the Dashboard component. <br /> {selectedBranchId}  <br />
  {user?.name}<br />
  {user?.admin_id}<br />
    {/* <div className="card border-orange shadow-md rounded-lg">
      <div className="card-header bg-primary text-white flex justify-between items-center px-4 py-3">
        <h4 className="flex items-center gap-2 text-lg font-semibold">
          <i className="fa fa-book"></i> Library Admin Dashboard
        </h4>
        <div className="card-tools">
        </div>
      </div>

      <div className="card-body p-4">
        <div className="row mb-4">
          <div className="col-md-9 col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white flex justify-between items-center px-3 py-2">
                <h4 className="text-md font-semibold">Recent Book Checkouts</h4>
                <a href="/bookAdd" className="text-white hover:underline text-sm">
                  <i className="fa fa-eye mr-1"></i>View
                </a>
              </div>
              <div className="card-body p-3">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="bg-light">
                      <tr>
                        <th>MEMBER</th>
                        <th>BOOK</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John Doe</td>
                        <td>The Great Gatsby</td>
                        <td>May 3, 2025</td>
                        <td><span className="bg-success text-white px-2 py-1 rounded">Active</span></td>
                        <td><button className="btn btn-sm btn-outline-primary">Extend</button></td>
                      </tr>
                      <tr>
                        <td>Jack Smith</td>
                        <td>The Great Gatsby</td>
                        <td>May 9, 2025</td>
                        <td><span className="bg-success text-white px-2 py-1 rounded">Active</span></td>
                        <td><button className="btn btn-sm btn-outline-primary">Extend</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light px-3 py-2">
                <h4 className="text-md font-semibold">Updates & Notifications</h4>
              </div>
              <div className="card-body p-3 text-secondary text-sm">
                No Notifications to Display
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12 col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light px-3 py-2">
                <h4 className="text-md font-semibold">Student Management</h4>
              </div>
              <div className="card-body p-3">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="bg-light">
                      <tr>
                        <th>Sr. No.</th>
                        <th>Name</th>
                        <th>Father's Name</th>
                        <th>Mobile</th>
                        <th>Admission Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>Jack Doe</td>
                        <td>9977678754</td>
                        <td>10-May-2025</td>
                        <td>
                          <a href="/studentEdit" className="text-primary mx-1"><i className="fa fa-edit"></i></a>
                          <a href="#" className="text-danger mx-1"><i className="fa fa-trash"></i></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6 col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light px-3 py-2">
                <h4 className="text-md font-semibold">Cabin Management</h4>
              </div>
              <div className="card-body">
                <input type="hidden" name="modal_type" value="LibraryCabin" />
                <div className="cabin-grid">
                  <div className="row" id="dataContainer-librarycabin"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light px-3 py-2">
                <h4 className="text-md font-semibold">Locker Management</h4>
              </div>
              <div className="card-body">
                <input type="hidden" name="modal_type" value="LibraryLocker" />
                <div className="locker-grid">
                  <div className="row" id="dataContainer-librarylocker"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div> */}
</div>

    </div>
  );
}

export default Dashboard;
