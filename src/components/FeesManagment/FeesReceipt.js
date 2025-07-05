import React, { useState } from "react";
import { useSelector } from "react-redux";
import DataTableWithExport from '../../components/common/DataTableWithExport';
import { formatDate } from "../../utils/formatDate";

const FeesReceipt = () => {

    const [isLoading, setIsLoading] = useState(false);
    const receipt = [
        {
            collect: "Admin",
            receipt_no: "RCPT001",
            status: "1",
            admission_no: "ADM001",
            class: "10-A",
            name: "Amit Sharma",
            father_name: "Rajesh Sharma",
            payment_date: "2025-06-01",
            discount: "500",
            fine: "0",
            amount: "4500"
        },
        {
            collect: "Admin",
            receipt_no: "RCPT002",
            status: "0",
            admission_no: "ADM002",
            class: "9-B",
            name: "Sita Verma",
            father_name: "Mohan Verma",
            payment_date: "2025-06-03",
            discount: "0",
            fine: "50",
            amount: "4550"
        },
        // Add more static data objects as needed
    ];


    // Columns for DataTable
    const columns = [
        {
            name: 'SR.NO',
            selector: row => row.srno, // <-- Add this line
            cell: (row, rowIndex) => row.srno,
        },
        { name: 'Collect', selector: row => row.collect || '' },
        {
            name: 'Receipt No',
            selector: row =>
                row.receipt_no || ''
        },
        { name: 'Status', selector: row => row.status },
        { name: 'Admission No', selector: row => row.admission_no },
        { name: 'Class', selector: row => row.class },
        { name: 'Student Name', selector: row => row.name },
        { name: 'Father Name', selector: row => row.father_name },
        { name: 'Payment Date', selector: row => row.payment_date },
        { name: 'Discount', selector: row => row.discount },
        { name: 'Fine', selector: row => row.fine },
        { name: 'Amount', selector: row => row.amount },


    ];

    const csvHeaders = [
        { label: "SR.NO", key: "srno" },
        { label: "Collect By", key: "collect" },
        { label: "Receipt No", key: "receipt_no" },
        { label: "Status", key: "status" },
        { label: "Admission No", key: "admission_no" },
        { label: "Gender", key: "gender" },
        { label: "Class", key: "class" },
        { label: "Student Name", key: "name" },
        { label: "Father's Name", key: "father_name" },
        { label: "Payment Date", key: "payment_date" },
        { label: "Discount", key: "discount" },
        { label: "Fine", key: "fine" },
        { label: "Amount", key: "amount" },
    ];


    // Map receipt data for export and table
    const exportMap = (receipt, idx) => ({
        srno: idx + 1,
        ...receipt,
        gender: receipt.gender,

        status: receipt.status === '1' ? 'Received' : 'Pending'
    });
    const receiptWithSrNo = receipt.map(exportMap);


    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item">
                            FeesManagment
                        </li>
                        <li className="breadcrumb-item">
                            FeesReceipt
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
                        data={receiptWithSrNo}
                        csvFileName="receipt.csv"
                        excelFileName="receipt.xlsx"
                        pdfFileName="receipt.pdf"
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
                        onBulkDeleteError={error => console.error('Error deleting Receipt:', error)}
                    />
                </div>
            </div>
        </div>

    )
}

export default FeesReceipt;