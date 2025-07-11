import React, { useState } from "react";
import ActionButton from "../common/ActionButton";
import DataTableWithExport from "../common/DataTableWithExport";

const Session = () => {

    const homeworkList = [
        {
            srno: 1,
            from_year: "2021",
            to_year: "22"
        },
        {
            srno: 2,
            from_year: "2022",
            to_year: "23"
        },
        {
            srno: 3,
            from_year: "2023",
            to_year: "24"
        },
        {
            srno: 4,
            from_year: "2024",
            to_year: "25"
        },
        {
            srno: 5,
            from_year: "2025",
            to_year: "26"
        },
        {
            srno: 6,
            from_year: "2026",
            to_year: "27"
        },

    ];


    const columns = [
        {
            name: 'SR.NO',
            selector: row => row.srno, // <-- Add this line
            cell: (row, rowIndex) => row.srno,
        },
        { name: 'From Year', selector: row => row.from_year || '' },
        {
            name: 'To Year',
            selector: row =>
                row.to_year || ''
        },
        {
            name: 'Action',
            cell: row =>
                row.role_id === 1 ? (
                    <span className="text-danger" style={{ fontSize: '10px' }}>Action Locked</span>
                ) : (
                    <>
                        {/* <ActionButton className="text-primry mr-1">
                            View
                        </ActionButton> */}
                        <ActionButton
                            className="text-warning mr-1"
                        // onClick={() => handleEdit(row)}
                        >
                            Edit
                        </ActionButton>
                        <ActionButton
                            className="text-danger"
                        // onClick={() => handleDelete(row.id,'' )}
                        >
                            Delete
                        </ActionButton>
                    </>
                ),
        },

    ];

    // Map receipt data for export and table
    const exportMap = (homeworkList, idx) => ({
        srno: idx + 1,
        ...homeworkList,

        // status: leaveList.status === '1' ? 'Approved' : 'Pending'
    });
    const homeworkListWithSrNo = homeworkList.map(exportMap);

    return (
        <div>
            {/* <div className="card card-orange card-outline">
                <div className="card-header bg-light">
                    <div className="card-title">
                        <h4><i class="fa-solid fa-calendar-week"></i> &nbsp;Sessions</h4>
                    </div>
                </div>
                <div className="card-body"> */}
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card card-orange card-outline">
                                <div className="card-header bg-light">
                                    <div className="card-title">
                                        <h4><i class="fa-solid fa-calendar-plus"></i> &nbsp;Add Sessions</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-12 mb-2">
                                                <label className="form-label">From Year</label>
                                                <input type="text" className="form-control" name="from_year" placeholder="From Year" />
                                            </div>
                                            <div className="col-md-12">
                                                <label className="form-label">To Year</label>
                                                <input type="text" className="form-control" name="to_year" placeholder="From Year" />
                                            </div>
                                            <div className="col-md-12 ">
                                                <button className="btn btn-primary mt-2">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card card-orange card-outline">
                                <div className="card-header bg-light">
                                    <div className="card-title">
                                        <h4><i class="fa-solid fa-calendar-plus"></i> &nbsp;View Sessions</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead className="bg-light">
                                                <tr>
                                                    {columns.map((col, index) => (
                                                        <th key={index}>{col.name}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {homeworkListWithSrNo.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {columns.map((col, colIndex) => (
                                                            <td key={colIndex}>
                                                                {col.cell ? col.cell(row, rowIndex) : col.selector(row)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        //     </div>
        // </div>
    )
}

export default Session;