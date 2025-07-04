import React from "react";

const FeesReceipt = () => {

    const tableHeaders = [
        "Sr.No.",
        "Admission No",
        "Class",
        "Student Name",
        "Father Name",
        "Mobile",
        "Total Fees",
        "Total Paid Fees",
        "Paid Fine",
        "Discount",
        "Pending Fees",
        "Action"
    ];

    const studentFeeData = [
        {
            srNo: 1, admissionNo: "A101", class: "1st", studentName: "Ashutosh", fatherName: "Rajeev Kumar", mobile: "8209949186", totalFees: 36000, totalPaidFees: 25000, paidFine: 200, discount: 1000, pendingFees: 9800
        },
        {
            srNo: 2, admissionNo: "A102", class: "2nd", studentName: "Shubham", fatherName: "Mahesh Singh", mobile: "7901234567", totalFees: 36000, totalPaidFees: 36000, paidFine: 0, discount: 0, pendingFees: 0
        },
        {
            srNo: 3, admissionNo: "A103", class: "1st", studentName: "Akshay Kumar", fatherName: "Ramesh Kumar", mobile: "9001234567", totalFees: 36000, totalPaidFees: 30000, paidFine: 100, discount: 500, pendingFees: 5400
        }
        // Add more rows as needed
    ];


    return (
        <div className="card card-orange card-outline">
            <div className="card-header bg-light">
                <div className="card-title">
                    <h4><i class="fa-solid fa-chart-column"></i> &nbsp;Student Fees Ledger</h4>
                </div>
            </div>
            <div className="card-body">
                {/* filters to search */}
                <form>
                    <div className="row">
                        <div className="col-md-2">
                            <label className="form-label">Class</label>
                            <select className="form-control" name="class">
                                <option selected>All</option>
                                <option value={1}>1st</option>
                                <option value={2}>2nd</option>
                                <option value={3}>3rd</option>
                                <option value={4}>4th</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">From Date</label>
                            <input type="date" className="form-control" name="start_date" />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">To Date</label>
                            <input type="date" className="form-control" name="to_date" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Search By Keywords</label>
                            <input type="text" className="form-control" name="search" placeholder="Ex. Name, Father Name, Mobile, Email etc." />
                        </div>
                        <div className="col-md-1 d-flex flex-column justify-content-end">
                            <a href="#" className="btn btn-primary">Search</a>
                        </div>
                    </div>
                </form>
                <div className="row mt-2">
                    <div className="col-md-12">
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped text-center">
                                <tbody>
                                    <td className="bg-primary">Total Fee</td>
                                    <td style={{ backgroundColor: '#e8e8e8' }}>₹ 8,02,903.00</td>
                                    <td className="bg-primary">Total Discount</td>
                                    <td style={{ backgroundColor: '#e8e8e8' }}>₹ 0.00</td>
                                    <td className="bg-primary">Total Collected</td>
                                    <td style={{ backgroundColor: '#e8e8e8' }}>₹ 1,50,000.00</td>
                                    <td className="bg-primary">Total Pending</td>
                                    <td style={{ backgroundColor: '#e8e8e8' }}>₹ 6,50,000.00</td>
                                    <td className="bg-primary">Total Fine</td>
                                    <td style={{ backgroundColor: '#e8e8e8' }}>₹ 0.00</td>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* download formats */}
                <div className="row mt-3">
                    <div className="col-md-6 ">
                        <div className="btn-group">
                            <a href="#" className="btn btn-secondary">Copy</a>
                            <a href="#" className="btn btn-secondary">CSV</a>
                            <a href="#" className="btn btn-secondary">Excel</a>
                            <a href="#" className="btn btn-secondary">PDF</a>
                            <a href="#" className="btn btn-secondary">Print</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex align-items-center justify-content-end ">
                            <label htmlFor="searchInput" className="me-2 mb-0 fw-semibold">
                                Search :
                            </label> &nbsp;
                            <input
                                type="text"
                                id="searchInput"
                                className="form-control form-control-sm"
                                style={{ maxWidth: '200px' }}
                                placeholder="Type to search..."
                            />
                        </div>
                    </div>

                </div>

                {/* Show Data */}
                <div className="row mt-3">
                    <div className="col-md-12">
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="bg-light">
                                    <tr>
                                        {tableHeaders.map((header, index) => (
                                            <th key={index}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentFeeData.map((student, index) => (
                                        <tr key={index}>
                                            <td>{student.srNo}</td>
                                            <td>{student.admissionNo}</td>
                                            <td>{student.class}</td>
                                            <td>{student.studentName}</td>
                                            <td>{student.fatherName}</td>
                                            <td>{student.mobile}</td>
                                            <td>₹{student.totalFees}</td>
                                            <td>₹{student.totalPaidFees}</td>
                                            <td>₹{student.paidFine}</td>
                                            <td>₹{student.discount}</td>
                                            <td>₹{student.pendingFees}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary"><i class="fa-solid fa-eye"></i></button>
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

    )
}

export default FeesReceipt;