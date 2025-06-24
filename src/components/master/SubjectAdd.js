import React from "react";
import ActionButton from "../common/ActionButton";
import DataTableWithExport from "../common/DataTableWithExport";



const SubjectAdd = () => {
    const columns = [
        {
            fields: [
                { label: "Subject Name", type: "text", name: "name", required: true },
                {
                    label: "Select Class",
                    type: "select",
                    name: "class",
                    required: true,
                    options: [
                        { label: "Nursery", value: "Nursery" },
                        { label: "First", value: "First" },
                        { label: "Second", value: "Second" },
                    ],
                },
                {
                    label: "Section",
                    type: "select",
                    name: "section",
                    required: true,
                    options: [
                        { label: "A", value: "A" },
                        { label: "B", value: "B" },
                        { label: "C", value: "C" },
                    ],
                },
                {
                    label: "Description",
                    type: "textarea",
                    name: "description",
                    required: false,
                },
            ],
        },
    ];

    const renderFields = (fields) => (
        <div className="row">
            {fields.map((field) => (
                <div className="col-12 mb-3" key={field.name}>
                    <label className="form-label">
                        {field.label}{" "}
                        {field.required && <span className="text-danger">*</span>}
                    </label>
                    {field.type === "select" ? (
                        <select className="form-control">
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : field.type === "textarea" ? (
                        <textarea className="form-control" rows="3" placeholder={`Enter ${field.label}`}></textarea>
                    ) : (
                        <input
                            type={field.type}
                            className="form-control"
                            placeholder={`Enter ${field.label}`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    const showdata = [
        {
            name: 'SR.NO', selector: row => row.srno, cell: (row, rowIndex) => row.srno, width: '70px'
        },
        { name: 'Branch', selector: row => row.branch_id === '-1' ? 'All Branches' : (row.branch_name || '') },
        { name: 'Class', selector: row => row.class },
        { name: 'Subject', selector: row => row.name },
        // { name: 'Mobile', selector: row => row.mobile, width: '150px' },
        // { name: 'E-Mail', selector: row => row.email },
        // { name: 'Gender', selector: row => row.gender },
        {
            name: 'Action',
            cell: row => (
                <>
                    <ActionButton className="text-warning mr-1">Edit</ActionButton>
                    <ActionButton className="text-danger">Delete</ActionButton>
                </>
            ),
        },
    ]
    const csvHeaders = [
        { label: "SR.NO", key: "srno" },
        { label: "Subject", key: "name" },
        { label: "Class", key: "class" },
        { label: "Section", key: "section" },
    ];


    return (
        <div>
            <div className="container-fluid">
                {/* Breadcrumb */}
                <div className="row">
                    <div className="col-md-12 col-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/dashboard">Dashboard</a>
                            </li>
                            <li className="breadcrumb-item">Subject</li>
                        </ul>
                    </div>
                </div>

                <div className="d-flex p-2 mb-1" style={{ backgroundColor: '#f1f1f1' }}>
                    <div className="row ">
                        <div className="col-md-12 col-12">
                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">
                                <i className="fa fa-plus"></i>
                            </button>
                           
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-12">
                        <div className="card">
                            <div className="card-body">
                                {/* <DataTableWithExport
                                    columns={showdata}
                                    data={subjectWithSrNo}
                                    csvFileName="subject.csv"
                                    excelFileName="subject.xlsx"
                                    pdfFileName="subject.pdf"
                                    searchPlaceholder="Search by name, subject, enrollment, mobile"
                                    exportHeaders={csvHeaders}
                                    // exportMap={exportMap}
                                    paginationRowsPerPageOptions={[10, 50, 300, 500, 1000]}
                                    defaultRowsPerPage={10}
                                    title="Subject List"
                                    // apiUrl={API_URL}
                                    modal="Subject"
                                    // token={token}
                                    // onBulkDeleteSuccess={() => dispatch(fetchStudentList({ API_URL, token }))}
                                    // onBulkDeleteError={error => console.error('Error deleting students:', error)}
                                /> */}
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>Sr.No</th>
                                                <th>Class</th>
                                                <th>Name</th>
                                                <th>Creation Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>first-A</td>
                                                <td>English</td>
                                                <td>22-06-2025</td>
                                                <td> <ActionButton className="btn btn-sm btn-warning mr-1">
                                                    Edit
                                                </ActionButton>
                                                    <ActionButton className="btn btn-sm btn-danger">
                                                        Delete
                                                    </ActionButton></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Modal */}
                <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addModalLabel">
                                    Add Subject
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    {columns.map((group, index) => (
                                        <div key={index}>{renderFields(group.fields)}</div>
                                    ))}
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SubjectAdd;
