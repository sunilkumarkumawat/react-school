import React from "react";
import ActionButton from "../common/ActionButton";

const FeesType = () => {
    const columns = [
        {
            fields: [
                { label: 'Fees Group', name: 'feesgroup', required: true, type: 'select', options: [{ label: 'Admission Fee', value: 'Admission Fee' }, { label: 'Sports Fee', value: 'Sports Fee' }, { label: 'Security Fee', value: 'Security Fee' }] },
                { label: 'Fees Type', name: 'name', type: 'text', required: true }
            ]
        }
    ]

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
        <div>
            {/* breadcrumb */}
            <div className="row">
                <div className="col-md-12 col-12">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item">
                            FeesMaster
                        </li>
                    </ul>
                </div>
            </div>
            {/* fees type form */}
            <div className="row">
                <div className="col-md-4">
                    <div className="card card-outline card-orange">
                        <div className="card-header bg-light">
                            <div className="card-title">
                                <h4>
                                    <i class="fa-solid fa-money-bill"></i> &nbsp;Fees Type
                                </h4>
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
                                <h4>
                                    <i className="fa fa-list"></i> Fees List
                                </h4>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Sr No</th>
                                            <th>Fees Type</th>
                                            <th>Fees Group</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>...</td>
                                            <td>Admission</td>
                                            <td>
                                                <ActionButton
                                                    className="btn btn-sm btn-warning mr-1">
                                                    Edit
                                                </ActionButton>
                                                <ActionButton
                                                    className="btn btn-sm btn-danger"
                                                >
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
        </div>
    )
}

export default FeesType;
