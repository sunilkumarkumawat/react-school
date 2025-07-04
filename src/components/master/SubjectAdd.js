import React from "react";
import ActionButton from "../common/ActionButton";

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
                                            <th>Class</th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>English</td>
                                            <td>First</td>
                                            <td>Akshay sir</td>
                                            <td>
                                                <ActionButton className="btn btn-sm btn-warning mr-1">
                                                    Edit
                                                </ActionButton>
                                                <ActionButton className="btn btn-sm btn-danger">
                                                    Delete
                                                </ActionButton>
                                            </td>
                                        </tr>
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