import React, { useState } from 'react';
import { Search, Eye, CreditCard, FileText, User, Phone, Calendar, X } from 'lucide-react';

const CollectFees = () => {
    const [selectedStudent, setSelectedStudent] = useState(true);
    const [showFeeDetails, setShowFeeDetails] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const students = [
        { id: 17, name: 'ashutosh', class: '1st', mobile: '8209949186' },
        { id: 19, name: 'Shubham', class: '1st', mobile: '8209949186' },
        { id: 20, name: 'akshay kumar', class: '1st', mobile: '8209949186' },
        { id: 21, name: 'Sidharth', class: '1st', mobile: '8209949186' },
        { id: 23, name: 'khushi', class: '1st', mobile: '8209949186' },
        { id: 21, name: 'KULDEEP RATHORE', class: '1st', mobile: '8209949186' },
        { id: 25, name: 'devansh', class: '1st', mobile: '8209949186' },
        { id: 26, name: 'deepak', class: '1st', mobile: '8209949186' }
    ];

    const feeStructure = [
        { type: '1st instalment', amount: 9000, discount: 0, paid: 9000, paidFine: '₹ 0.00', pending: '₹ 0', dueDate: '', fine: '₹ 0' },
        { type: '2nd instalment', amount: 9000, discount: 0, paid: 9000, paidFine: '₹ 0.00', pending: '₹ 0', dueDate: '', fine: '₹ 0' },
        { type: '3rd instalment', amount: 9000, discount: 0, paid: 9000, paidFine: '₹ 0.00', pending: '₹ 0', dueDate: '', fine: '₹ 0' },
        { type: '4th instalment', amount: 9000, discount: 0, paid: 9000, paidFine: '₹ 0.00', pending: '₹ 0', dueDate: '', fine: '₹ 0' },
        { type: 'Admission Fee', amount: 2100, discount: 0, paid: 1000, paidFine: '₹ 0.00', pending: '₹ 1100', dueDate: '', fine: '₹ 0' }
    ];

    const payment = [
        { type: 'Admission Fee', receipt: 2234, amount: 9000, discount: 0, paidFine: '₹ 0.00', mode: 'Online', bankname: 'sbi', transictionid: '1234567', status: 'received' },
        { type: 'Admission Fee', receipt: 2234, amount: 9000, discount: 0, paidFine: '₹ 0.00', mode: 'Online', bankname: 'sbi', transictionid: '1234567', status: 'received' },
        { type: 'Admission Fee', receipt: 2234, amount: 9000, discount: 0, paidFine: '₹ 0.00', mode: 'Online', bankname: 'sbi', transictionid: '1234567', status: 'received' },
        { type: 'Admission Fee', receipt: 2234, amount: 9000, discount: 0, paidFine: '₹ 0.00', mode: 'Online', bankname: 'sbi', transictionid: '1234567', status: 'received' }
    ];


    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm)
    );

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setShowFeeDetails(null);
    };

    const closeFeeDetails = () => {
        setShowFeeDetails(false);
        setSelectedStudent(true);
    };

    const feeHeads = [
        { label: 'Admission Fee' },
        { label: '1st instalment' },
        { label: '2nd instalment' },
        { label: '3rd instalment' },
        { label: '4th instalment' },
    ];

    const [feeInputs, setFeeInputs] = useState(
        feeHeads.map(() => ({
            selected: false,
            amount: '',
            discount: '',
            fine: ''
        }))
    );

    const handleFeeInputChange = (index, field, value) => {
        const updatedInputs = [...feeInputs];
        if (field === 'selected') {
            updatedInputs[index][field] = !updatedInputs[index][field];
        } else {
            updatedInputs[index][field] = value;
        }
        setFeeInputs(updatedInputs);
    };

    const [paymentData, setPaymentData] = useState({
        mode: 'Cash',
        status: 'Payment Received',
        total: 0,
        fine: 0,
        date: new Date().toISOString(), // Default to today's date
        remark: ''
    });

    const handlePaymentChange = (field, value) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    return (
        <div className="card card-outline card-orange">
            {/* Header */}
            <div className="card-header bg-light">
                <div className="card-title">

                    <h4 className="m-0"><CreditCard className="me-2" size={22} /> Student Fee Collection</h4>
                </div>

            </div>

            {/* {!showFeeDetails ? ( */}

            <div className="p-3">
                {/* Search and Filters */}
                <form>
                    <div className="row ">
                        <div className="col-md-2">
                            <label className='form-label'>Admission Type(Non-RTE)</label>
                            <select className="form-control">
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className='form-label'>Select Class</label>
                            <select className="form-control">
                                <option selected>select</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className='form-label'>Admission No</label>
                            <input type="text" className="form-control " placeholder="Admission No." />
                        </div>

                        <div className="col-md-4">
                            <label className='form-label'>Search By Keywords</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or admission no..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='col-md-1'>
                            <button className="btn btn-primary mt-3" type="button">
                                <Search size={16} />
                            </button>
                        </div>
                    </div>
                </form>
                {/* Student Table */}

                <div className='row mt-3'>
                    <div className='col-md-7'>
                        <div className='card '>
                            <div className='card-header bg-light'>
                                <h4>Student list</h4>
                            </div>
                            <div className='card-body'>
                                <div className="table-responsive " style={{ maxHeight: '225px' }}>
                                    <table className="table table-hover mb-0 table-bordered">
                                        <thead className="bg-light text-white" style={{ position: 'sticky', top: '0' }}>
                                            <tr>
                                                <th>Admission No.</th>
                                                <th>Student Name</th>
                                                <th>Class</th>
                                                <th>Mobile</th>
                                                <th>Fee Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student, index) => (
                                                <tr key={index}>
                                                    <td className="fw-bold text-primary">{student.id}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center mr-2"
                                                                style={{ width: '25px', height: '25px' }}>
                                                                <User size={16} className="text-white" />
                                                            </div>
                                                            {student.name}
                                                        </div>
                                                    </td>
                                                    <td><span className="badge bg-secondary">{student.class}</span></td>
                                                    <td>
                                                        <Phone size={14} className="me-1" /> &nbsp;
                                                        {student.mobile}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-success">Paid</span> &nbsp;
                                                        <span className="badge bg-warning ms-1">₹1100 Due</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* student profile */}
                    <div className='col-md-5' >
                        <div className='card'>
                            <div className='card-header bg-light'>
                                <h4>Student Profile</h4>
                            </div>
                            <div className='card-body'>
                                <div className="table-responsive border">
                                    <table className="table table-bordered align-middle mb-0">
                                        <tbody>
                                            <tr>
                                                <td rowSpan="5" className="text-center" style={{ width: '150px' }}>
                                                    <img
                                                        src="https://cdn-icons-png.flaticon.com/512/145/145867.png"
                                                        alt="Student"
                                                        className="img-fluid"
                                                        style={{ maxHeight: '120px', backgroundColor: '#ffc107', padding: '10px' }}
                                                    />
                                                </td>
                                                <td className="fw-bold">Name</td>
                                                <td className="fw-bold">ISHA KANWAR</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold">Mobile</td>
                                                <td className="fw-bold">9023456378</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold">Father</td>
                                                <td className="fw-bold">MAHESH SINGH</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold">Mother</td>
                                                <td className="fw-bold">REKHA KANWAR</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold">Father Mobile</td>
                                                <td className="fw-bold">4567890237</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* ) : ( */}
            <div className="p-3">


                <div className="row">
                    {/* Fee Structure */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header bg-light text-white d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Fee Structure - Advance Fees: ₹78500</h6>
                                <span className="badge bg-success text-success">Receipt No: 0030</span>
                            </div>
                            <div className='card-body'>
                                <div className="table-responsive">
                                    <table className="table table-sm mb-0 table">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className='col-md-1'>Fee Type</th>
                                                <th className='col-md-1'>Amount</th>
                                                <th className='col-md-1'>Discount</th>
                                                <th className='col-md-2'>Paid</th>
                                                <th className='col-md-1'>Paid Fine</th>
                                                <th className='col-md-1'>Pending</th>
                                                <th className='col-md-1'>Due Date</th>
                                                <th className='col-md-1'>Fine</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feeStructure.map((fee, index) => (
                                                <tr key={index} className={fee.pending !== '₹ 0' ? 'table-warning' : ''}>
                                                    <td className="fw-bold">{fee.type}</td>
                                                    <td>₹ {fee.amount}</td>
                                                    <td>₹ {fee.discount}</td>
                                                    <td className="text-success fw-bold">₹ {fee.paid}</td>
                                                    <td className="text-danger">{fee.paidFine}</td>
                                                    <td className={fee.pending !== '₹ 0' ? 'text-warning fw-bold' : 'text-success'}>
                                                        {fee.pending}
                                                    </td>
                                                    <td>
                                                        05/06/2025
                                                    </td>
                                                    <td className="text-danger">{fee.fine}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-info text-white">
                                            <tr>
                                                <th>Total</th>
                                                <th>₹ 38100</th>
                                                <th>₹ 0</th>
                                                <th>₹ 37000</th>
                                                <th>₹ 0.00</th>
                                                <th>₹ 1100</th>
                                                <th></th>
                                                <th>₹ 0</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header bg-light text-dark">
                                <h6 className="mb-0">Payment Details</h6>
                            </div>
                            <div className="card-body">

                                <div className="table-responsive mb-2">
                                    <table className="table align-middle table-borderless mb-0">
                                        <thead className="bg-light text-dark fw-semibold small">
                                            <tr>
                                                <th className='col-md-1'>Select Head*</th>
                                                <th className='col-md-1'>Amount*</th>
                                                <th className='col-md-1'>Discount</th>
                                                <th className='col-md-1'>Fine</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feeHeads.map((head, index) => (
                                                <tr key={index}>
                                                    {/* Select Head */}
                                                    <td>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input me-2"
                                                                type="checkbox"
                                                                checked={feeInputs[index].selected}
                                                                onChange={() => handleFeeInputChange(index, 'selected')}
                                                            />
                                                            <label className="form-check-label fw-semibold">
                                                                {head.label}
                                                            </label>
                                                        </div>
                                                    </td>

                                                    {/* Amount Input */}
                                                    <td>
                                                        <input
                                                            type="text"
                                                            placeholder="Amount"
                                                            className="form-control form-control-sm "
                                                            value={feeInputs[index].amount}
                                                            onChange={(e) =>
                                                                handleFeeInputChange(index, 'amount', e.target.value)
                                                            }
                                                        />
                                                    </td>

                                                    {/* Discount Input */}
                                                    <td>
                                                        <input
                                                            type="text"
                                                            placeholder="Discount"
                                                            className="form-control form-control-sm "
                                                            value={feeInputs[index].discount}
                                                            onChange={(e) =>
                                                                handleFeeInputChange(index, 'discount', e.target.value)
                                                            }
                                                        />
                                                    </td>

                                                    {/* Fine Input */}
                                                    <td>
                                                        <input
                                                            type="text"
                                                            placeholder="0"
                                                            className="form-control form-control-sm "
                                                            value={feeInputs[index].fine}
                                                            onChange={(e) =>
                                                                handleFeeInputChange(index, 'fine', e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <hr className='my-2' />
                                <div className="row mb-1">
                                    {/* Payment Mode */}
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label fw-semibold">Payment Mode</label>
                                        <select
                                            className="form-control"
                                            name="paymentMode"
                                            value={paymentData.paymentMode}
                                            onChange={handlePaymentChange}
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Card">Card</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                        </select>
                                    </div>

                                    {/* Payment Status */}
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label fw-semibold">Payment Status</label>
                                        <select
                                            className="form-control"
                                            name="paymentStatus"
                                            value={paymentData.paymentStatus}
                                            onChange={handlePaymentChange}
                                        >
                                            <option value="Received">Payment Received</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                    </div>

                                    {/* Total */}
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label fw-semibold">Total</label>
                                        <input
                                            type="text"
                                            readOnly
                                            className="form-control form-control-sm"
                                            value={paymentData.totalAmount}
                                        />
                                    </div>

                                    {/* Fine */}
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label fw-semibold">Total Fine</label>
                                        <input
                                            type="text"
                                            readOnly
                                            className="form-control form-control-sm"
                                            value={paymentData.totalFine}
                                        />
                                    </div>

                                    {/* Payment Date */}
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label fw-semibold">Payment Date</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            name="paymentDate"
                                            value={paymentData.paymentDate}
                                            onChange={handlePaymentChange}
                                        />
                                    </div>

                                    {/* Remark */}
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label fw-semibold">Remark</label>
                                        <textarea

                                            className="form-control form-control-sm"
                                            name="remark"
                                            value={paymentData.remark}
                                            onChange={handlePaymentChange}
                                        />
                                    </div>
                                </div>
                                <hr className='my-2' />

                                <div className="bg-light p-2 rounded mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span>Aggregate:</span>
                                        <span className="fw-bold">₹0</span>
                                    </div>
                                    <div className="d-flex justify-content-between text-danger">
                                        <span>Discount:</span>
                                        <span className="fw-bold">₹0</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top pt-1">
                                        <span className="fw-bold">Grand Total:</span>
                                        <span className="fw-bold">₹0</span>
                                    </div>
                                </div>

                                <div className="col-md-12 p-0 text-center">
                                    <button className="btn btn-primary btn-sm mr-md-2">
                                        <CreditCard size={16} className="me-1" />&nbsp;
                                        Collect
                                    </button>
                                    <button className="btn btn-primary btn-sm">
                                        <FileText size={14} className="me-1" />&nbsp;
                                        Collect & Print
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                <div className="card shadow-sm mt-3">
                    <div className="card-header bg-light text-white">
                        <h6 className="mb-0">Payment History</h6>
                    </div>
                    <div className='card-body'>
                        <div className="table-responsive">
                            <table className="table table-sm table-striped">
                                <thead className="bg-light text-white">
                                    <tr>
                                        <th>Head Name</th>
                                        <th>Receipt No.</th>
                                        <th>Payment Date</th>
                                        <th>Amount</th>
                                        <th>Discount</th>
                                        <th>Fine</th>
                                        <th>Payment Mode</th>
                                        <th>Bank Name</th>
                                        <th>Transaction Id</th>
                                        <th>Payment Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payment.map((amt, index) => (
                                        <tr key={index} className={amt.pending !== '₹ 0' }>
                                            <td className="fw-bold">{amt.type}</td>
                                            <td>{amt.receipt}</td>
                                            <td>03/07/2025</td>
                                            <td className="text-success fw-bold">₹ {amt.amount}</td>
                                            <td>₹ {amt.discount}</td>
                                            <td className="text-danger">{amt.paidFine}</td>
                                            <td >
                                        {amt.mode}
                                            </td>
                                            <td>
                                               {amt.bankname}
                                            </td>
                                            <td>{amt.transictionid}</td>
                                            <td className='text-success'>{amt.status}</td>
                                            <td className="text-danger">
                                                <a href='#' className='btn btn-danger'><i class="fa-solid fa-rotate-right"></i></a>
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
    );
};

export default CollectFees;