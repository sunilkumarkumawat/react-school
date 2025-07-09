import React, { useState } from "react";
import ActionButton from "../common/ActionButton";
import DataTableWithExport from "../common/DataTableWithExport";

const SubjectAdd = () => {
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        {
            fields: [
                { label: "Subject Name", type: "text", name: "name", required: true },

                {
                    label: "Subject Type",
                    type: "select",
                    name: "type",
                    required: true,
                    options: [
                        {label : 'Main', value :'Main'}, 
                        {label : 'Other', value :'Other'}, 
                    ]
                },
            ],
        },
    ];

    // subject list
    const subjectList = [
        { srno: 1, subject_name: "Mathematics" },
        { srno: 2, subject_name: "English" },
        { srno: 3, subject_name: "Science" },
        { srno: 4, subject_name: "History" },
        { srno: 5, subject_name: "Geography" }
    ];



    // Map receipt data for export and table
    const exportMap = (subject, idx) => ({
        srno: idx + 1,
        ...subject,
    });




    const renderFields = (fields) => (
        <div className="row">
            {fields.map((field) => (
                <div className="col-12 mb-3" key={field.name}>
                    <label className="form-label">
                        {field.label}{" "}
                        {field.required && <span className="text-danger">*</span>}
                    </label>

                    {field.type === "select" ? (
                        <select className="form-control" defaultValue="">
                            <option value="" disabled>Select {field.label}</option>
                            {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
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

    return (
        <div className="">
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
            <div className="row">
                <div className="col-md-4 col-12">
                    <div className="card card-outline card-orange">
                        <div className="card-header bg-light">
                            <div className="card-title">
                                <h4><i class="fa-brands fa-leanpub"></i> &nbsp;Add Subject</h4>
                            </div>
                        </div>
                        <div className="card-body">
                            <form>
                                {columns.map((group, index) => (
                                    <div key={index}>{renderFields(group.fields)}</div>
                                ))}
                                <div className="col-md-12 col-12 p-0">
                                    <button className="btn btn-primary" type="submit">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>



                <div className="col-md-8 col-12">
                    <div className="card card-orange card-outline">
                        <div className="card-header bg-light">
                            <div className="card-title">
                                <h4><i className="fa fa-list"></i> Subject List</h4>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Sr.No.</th>
                                            <th>Subject Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjectList.map(subject => (
                                            <tr key={subject.srno}>
                                                <td>{subject.srno}</td>
                                                <td>{subject.subject_name}</td>
                                                <td>
                                                    <ActionButton
                                                        className="text-warning mr-1"
                                                    >
                                                        Edit
                                                    </ActionButton>
                                                    <ActionButton
                                                        className="text-danger"
                                                    >
                                                        Delete
                                                    </ActionButton>
                                                </td>
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
    )
}

export default SubjectAdd;