import React, { useState } from "react";
import DataTableWithExport from '../common/DataTableWithExport';
import { formatDate } from "../../utils/formatDate";
import ActionButton from "../common/ActionButton";

const ComplaintList = () => {

    const [isLoading, setIsLoading] = useState(false);
    const complaintList = [
        {
            name: "Rahul Verma",
            mobile: "9876543210",
            subject: "Broken Chair in Classroom",
            description: "Chair in class 9A is broken and unsafe to sit.",
            date: "2025-07-05",
            admin_action: "Pending"
        },
        {
            name: "Priya Mehta",
            mobile: "9123456780",
            subject: "Fan Not Working",
            description: "The ceiling fan in class 10B isn't working.",
            date: "2025-07-03",
            admin_action: "Resolved"
        },
        {
            name: "Anuj Sharma",
            mobile: "9812345678",
            subject: "Water Leakage",
            description: "Water is leaking from the roof in class 8C.",
            date: "2025-06-29",
            admin_action: "In Progress"
        }
    ];




    // Columns for DataTable
    const columns = [
        {
            name: 'SR.NO',
            selector: row => row.srno, // <-- Add this line
            cell: (row, rowIndex) => row.srno,
        },
        { name: 'Name', selector: row => row.name || '' },
        {
            name: 'Mobile No',
            selector: row =>
                row.mobile || ''
        },
        { name: 'Subject', selector: row => row.subject },
        { name: 'Description', selector: row => row.description },
        {
            name: 'Date',
            selector: row => formatDate(row.date, "DD-MM-YYYY"),
        },
        { name: 'Admin Action', selector: row => row.admin_action },
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
        { label: "Name", key: "name" },
        { label: "Mobile", key: "mobile" },
        { label: "Subject", key: "subject" },
        { label: "Description", key: "description" },
        { label: "Date", key: "date" },
        { label: "Admin Action", key: "father_name" }
    ];



    // Map receipt data for export and table
    const exportMap = (complaintList, idx) => ({
        srno: idx + 1,
        ...complaintList,
    });
    const complaintListWithSrNo = complaintList.map(exportMap);


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
                            ComplaintList
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
                        data={complaintListWithSrNo}
                        csvFileName="complaintList.csv"
                        excelFileName="complaintList.xlsx"
                        pdfFileName="complaintList.pdf"
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
                        onBulkDeleteError={error => console.error('Error deleting complaintList:', error)}
                    />
                </div>
            </div>
        </div>

    )
}

export default ComplaintList;