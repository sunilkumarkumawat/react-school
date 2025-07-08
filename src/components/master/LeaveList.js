import React, { useState } from "react";
import DataTableWithExport from '../common/DataTableWithExport';
import { formatDate } from "../../utils/formatDate";
import ActionButton from "../common/ActionButton";

const LeaveList = () => {

    const [isLoading, setIsLoading] = useState(false);
    const leaveList = [
        {
            name: "Amit Kumar",
            subject: "Medical Leave",
            status: "0",
            date: "2025-07-04",
            reason: "High fever and doctor advised rest",
        },
        {
            name: "Sneha Sharma",
            subject: "Personal Work",
            status: "1",
            date: "2025-07-05",
            reason: "Family function at home",
        },
        {
            name: "Ravi Verma",
            subject: "Travel Leave",
            status: "1",
            date: "2025-07-03",
            reason: "Travel to native place",
        },
    ];





    // Columns for DataTable
    const columns = [
        {
            name: 'SR.NO',
            selector: row => row.srno, // <-- Add this line
            cell: (row, rowIndex) => row.srno,
        },
        { name: 'Student Name', selector: row => row.name || '' },
        {
            name: 'Status',
            selector: row =>
                row.status || ''
        },
        { name: 'Subject', selector: row => row.subject },
        {
            name: 'Date',
            selector: row => formatDate(row.date, "DD-MM-YYYY"),
        },
        { name: 'Reason', selector: row => row.reason },
        {
            name: 'Action',
            cell: row =>
                row.role_id === 1 ? (
                    <span className="text-danger" style={{ fontSize: '10px' }}>Action Locked</span>
                ) : (
                    <>
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

    const csvHeaders = [
        { label: "SR.NO", key: "srno" },
        { label: "Student Name", key: "name" },
        { label: "Status", key: "status" },
        { label: "Subject", key: "subject" },
        { label: "Date", key: "date" },
        { label: "Reason", key: "reason" },
    ];




    // Map receipt data for export and table
    const exportMap = (leaveList, idx) => ({
        srno: idx + 1,
        ...leaveList,

        status: leaveList.status === '1' ? 'Approved' : 'Pending'
    });
    const leaveListWithSrNo = leaveList.map(exportMap);


    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item">
                            Master
                        </li>
                        <li className="breadcrumb-item">
                            LeaveList
                        </li>
                    </ul>
                </div>
            </div>

            <div className="table-blur-wrapper mt-3 " style={{ position: "relative" }}>
                {(isLoading) && (
                    <div
                        style={{
                            position: "absolute",
                            zIndex: 2,
                            top: 0,
                            left: 0,
                            width: "100%",
                            minHeight: "100%",
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
                <div style={{ filter: (isLoading) ? "blur(3px)" : "none", pointerEvents: (isLoading) ? "none" : "auto" }}>
                    <DataTableWithExport
                        columns={columns}
                        data={leaveListWithSrNo}
                        csvFileName="leaveList.csv"
                        excelFileName="leaveList.xlsx"
                        pdfFileName="leaveList.pdf"
                        searchPlaceholder="Search by name, email, mobile, role"
                        exportHeaders={csvHeaders}
                        exportMap={exportMap}
                        paginationRowsPerPageOptions={[10, 50, 300, 500, 1000]}
                        defaultRowsPerPage={10}
                        title="Receipt"
                        apiUrl=""
                        modal=""
                        token=""
                        onBulkDeleteSuccess={() => { }}
                        onBulkDeleteError={error => console.error('Error deleting leaveList:', error)}
                    />
                </div>
            </div>
        </div>

    )
}

export default LeaveList;