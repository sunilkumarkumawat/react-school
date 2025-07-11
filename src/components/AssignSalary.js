import React, { useState } from "react";

const AssignSalary = () => {

    const columns = [
        { name: 'SR.NO', selector: 'srno' },
        { name: 'Name', selector: 'name' },
        { name: 'Mobile', selector: 'mobile' },
        { name: 'Salary', selector: 'salary' },
        { name: 'Basic', selector: 'basic' },
        { name: 'DA', selector: 'da' },
        { name: 'TDS%', selector: 'tds' },
        { name: 'PF%', selector: 'pf' },
    ];

    const [salaryList, setSalaryList] = useState([
        { srno: 1, name: 'Amit Sharma', mobile: '9876543210', salary: '', basic: '', da: '', tds: '', pf: '' },
        { srno: 2, name: 'Sneha Gupta', mobile: '8765432109', salary: '', basic: '', da: '', tds: '', pf: '' },
        { srno: 3, name: 'Ravi Yadav', mobile: '7654321098', salary: '', basic: '', da: '', tds: '', pf: '' }
    ]);

    const handleChange = (index, field, value) => {
        const updatedList = [...salaryList];
        updatedList[index][field] = value;
        setSalaryList(updatedList);
    };

    return (
        <div>
            <div className="card card-orange card-outline">
                <div className="card-header bg-light">
                    <div className="card-title">
                        <h4><i className="fa-brands fa-shirtsinbulk"></i> &nbsp;Staff Salary Details</h4>
                    </div>
                </div>
                <div className="card-body">

                    {/* filter form */}
                    <div className="bg-item rounded border p-2 mb-4">
                        <form>
                            <div className="row">
                                <div className="col-md-2">
                                    <label className="form-label">Select Role</label>
                                    <select className="form-control" name="class">
                                        <option selected>select</option>
                                        <option value={1}>Admin</option>
                                        <option value={2}>Faculty</option>
                                        <option value={3}>Watchmen</option>
                                        <option value={4}>Other</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Search By Keywords</label>
                                    <input type="text" className="form-control" name="search" placeholder="Ex. Name, Mobile, etc." />
                                </div>
                                <div className="col-md-1 d-flex flex-column justify-content-end mt-3">
                                    <a href="#" className="btn btn-primary">Search</a>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* show salary data */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="bg-light">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx}>{col.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {salaryList.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex}>
                                                {['salary', 'basic', 'da', 'tds', 'pf'].includes(col.selector) ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={row[col.selector]}
                                                        onChange={(e) => handleChange(rowIndex, col.selector, e.target.value)}
                                                    />
                                                ) : (
                                                    row[col.selector]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr style={{backgroundColor : '#787878', color: '#fff', height : '35px', fontWeight:'600'}}>
                                    <td colSpan={2}></td>
                                    <td>Total Salary</td>
                                    <td>Rs. 0.00</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="col-md-12 text-center">
                                <button className="btn btn-primary" type="submit">
                                    Save
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignSalary;
