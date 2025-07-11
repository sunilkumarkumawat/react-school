import React, { useState, useEffect, useRef } from "react";
import DataTableWithExport from "./common/DataTableWithExport";
import ActionButton from "./common/ActionButton";
import { formatDate } from "../utils/formatDate";

const Homework = () => {

    const [isLoading, setIsLoading] = useState(false);

    // ✅ Class List
    const classList = [
        "1st", "2nd", "3rd", "4th", "5th", "6th",
        "7th", "8th", "9th", "10th", "11th", "12th"
    ];

    const homeworkList = [
        {
            srno: 1,
            title: "Algebra Assignment",
            assign: "Mr. Rajeev Sharma",
            class: "10A",
            subject: "Mathematics",
            issue_date: "2025-07-02",
            submission_date: "2025-07-05"
        },
        {
            srno: 2,
            title: "Grammar Worksheet",
            assign: "Ms. Anjali Mehta",
            class: "8B",
            subject: "English",
            issue_date: "2025-07-03",
            submission_date: "2025-07-07"
        },
        {
            srno: 3,
            title: "Science Project - Solar System",
            assign: "Dr. Ramesh Singh",
            class: "6C",
            subject: "Science",
            issue_date: "2025-07-02",
            submission_date: "2025-07-10"
        },
        {
            srno: 4,
            title: "History Notes Completion",
            assign: "Mrs. Kavita Sinha",
            class: "9D",
            subject: "History",
            issue_date: "2025-07-05",
            submission_date: "2025-07-08"
        }
    ];


    const classSubjectMap = {
        "1st": ["English", "Maths", "EVS", "Hindi"],
        "2nd": ["English", "Maths", "EVS", "Hindi"],
        "3rd": ["English", "Maths", "EVS", "Hindi", "Computer"],
        "4th": ["English", "Maths", "EVS", "Hindi", "Computer"],
        "5th": ["English", "Maths", "Science", "Social Studies", "Hindi", "Computer"],
        "6th": ["English", "Maths", "Science", "Social Studies", "Hindi", "Computer"],
        "7th": ["English", "Maths", "Science", "Social Studies", "Hindi", "Computer"],
        "8th": ["English", "Maths", "Science", "Social Studies", "Hindi", "Computer"],
        "9th": ["English", "Maths", "Science", "Social Science", "Hindi", "IT"],
        "10th": ["English", "Maths", "Science", "Social Science", "Hindi", "IT"],
        "11th": ["English", "Physics", "Chemistry", "Maths", "Biology", "Computer Science"],
        "12th": ["English", "Physics", "Chemistry", "Maths", "Biology", "Computer Science"],
    };

    const [formData, setFormData] = useState({
        class: "",
        subject: "",
        issue_date: "",
        submission_date: "",
        title: "",
        description: "",
    });

    const editorRef = useRef(null);

    useEffect(() => {
        if (window.CKEDITOR && editorRef.current) {
            window.CKEDITOR.replace(editorRef.current);
            window.CKEDITOR.instances.description.on("change", function () {
                const data = window.CKEDITOR.instances.description.getData();
                setFormData((prev) => ({ ...prev, description: data }));
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "class" ? { subject: "" } : {}),
        }));
    };

    const columns = [
        {
            name: 'SR.NO',
            selector: row => row.srno, // <-- Add this line
            cell: (row, rowIndex) => row.srno,
        },
        { name: 'Title', selector: row => row.title || '' },
        {
            name: 'Assigned By',
            selector: row =>
                row.assign || ''
        },
        { name: 'Class', selector: row => row.class },
        { name: 'Subject', selector: row => row.subject },
        // {
        //     name: 'Homework Submission',
        //     selector: row => formatDate(row.date, "DD-MM-YYYY"),
        // },
        {
            name: 'Homework Issue Date',
            selector: row => formatDate(row.issue_date, "DD-MM-YYYY"),
        },
        {
            name: 'Submission Date',
            selector: row => formatDate(row.submission_date, "DD-MM-YYYY"),
        },
        // { name: 'Reason', selector: row => row.reason },
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

    // csv header list
    const csvHeaders = [
        { label: 'SR.NO', key: 'srno' },
        { label: 'Title', key: 'title' },
        { label: 'Assigned By', key: 'assign' },
        { label: 'Class', key: 'class' },
        { label: 'Subject', key: 'subject' },
        { label: 'Homework Given Date', key: 'date' },         // or rename if needed
        { label: 'Issue Recorded Date', key: 'issue_date' },   // or rename if needed
        { label: 'Submission Date', key: 'submission_date' },
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
                        <h4><i className="fa-solid fa-flask"></i> &nbsp;Homework</h4>
                    </div>
                </div>
                <div className="card-body"> */}
                    <div className="row">

                        {/* Add part */}
                        <div className="col-md-12">
                            <div className="card card-orange card-outline">
                                <div className="card-header bg-light">
                                    <div className="card-title">
                                        <h4><i className="fa-solid fa-flask"></i> &nbsp;Add Homework</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-3 mb-1">
                                                <label className="form-label">Class</label>
                                                <select
                                                    className="form-control"
                                                    name="class"
                                                    value={formData.class}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Select Class --</option>
                                                    {Object.keys(classSubjectMap).map((cls) => (
                                                        <option key={cls} value={cls}>
                                                            {cls}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-3 mb-1">
                                                <label className="form-label">Subject</label>
                                                <select
                                                    className="form-control"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    disabled={!formData.class}
                                                >
                                                    <option value="">-- Select Subject --</option>
                                                    {formData.class &&
                                                        classSubjectMap[formData.class].map((subj) => (
                                                            <option key={subj} value={subj}>
                                                                {subj}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            <div className="col-md-3 mb-1">
                                                <label>Issue Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="issue_date"
                                                    value={formData.issue_date}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-1">
                                                <label>Submission Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="submission_date"
                                                    value={formData.submission_date}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-1">
                                                <label>Homework Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    placeholder="Homework Title"
                                                />
                                            </div>

                                            <div className="col-md-9 mb-2">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    name="description"
                                                    ref={editorRef}
                                                    defaultValue={formData.description}
                                                    className="form-control"
                                                    rows={16}
                                                ></textarea>
                                            </div>

                                            <div className="col-12 text-center">
                                                <button type="submit" className="btn btn-primary mt-2 px-4">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* view part */}
                        <div className="col-md-12">
                            <div className="card card-orange card-outline">
                                <div className="card-header bg-light">
                                    <div className="card-title">
                                        <h4><i className="fa-solid fa-flask"></i> &nbsp;View Homework</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {/* <div className="bg-item rounded border p-2">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="form-label">Class</label>
                                                    <select
                                                        className="form-control"
                                                        name="class"
                                                        value={formData.class}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Select Class</option>
                                                        {Object.keys(classSubjectMap).map((cls) => (
                                                            <option key={cls} value={cls}>
                                                                {cls}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-5">
                                                    <label className="form-label">Search By Keyword</label>
                                                    <input type="text" className="form-control" placeholder="Ex. Name, Mobile, Email, Aadhar etc. " />
                                                </div>
                                                <div className="col-1 text-center d-flex align-items-end">
                                                    <button type="submit" className="btn btn-primary mt-2 px-4">
                                                        Search
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div> */}
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
                                                data={homeworkListWithSrNo}
                                                csvFileName="homeworkList.csv"
                                                excelFileName="homeworkList.xlsx"
                                                pdfFileName="homeworkList.pdf"
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
                            </div>
                        </div>
                    </div>

                </div>
        //     </div>
        // </div>
    );
};

export default Homework;

