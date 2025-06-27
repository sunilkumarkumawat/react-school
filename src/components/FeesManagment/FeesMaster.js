import { gridLayer } from 'leaflet';
import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

const FeesMaster = () => {
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedFeeTypes, setSelectedFeeTypes] = useState([]);

    const classes = [
        { id: 1, name: 'Class 1' },
        { id: 2, name: 'Class 2' },
        { id: 3, name: 'Class 3' },
        { id: 4, name: 'Class 4' },
    ];

    const feeGroups = {
        1: [{ id: 'g1', name: 'Group A' }, { id: 'g2', name: 'Group B' }],
        2: [{ id: 'g3', name: 'Group C' }],
        3: [{ id: 'g4', name: 'Group D' }],
    };

    const feeTypes = {
        g1: [{ id: 't1', type: 'Tuition', amount: 10000, due: '2025-07-01' }],
        g2: [{ id: 't2', type: 'Transport', amount: 2000, due: '2025-07-10' }],
        g3: [{ id: 't3', type: 'Books', amount: 1500, due: '2025-07-05' }],
        g4: [
            { id: 't4', type: 'Exam', amount: 1000, due: '2025-07-15' },
            { id: 't5', type: 'Sports', amount: 500, due: '2025-08-01' }
        ]
    };

    const toggleClass = (id) => {
        setSelectedGroups([]);
        setSelectedFeeTypes([]);
        setSelectedClasses((prev) =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const toggleGroup = (id) => {
        setSelectedFeeTypes([]);
        setSelectedGroups((prev) =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const toggleFeeType = (id) => {
        setSelectedFeeTypes((prev) =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    return (
        <div className="">
            <div className='row'>
                <div className='col-md-12 col-12'>
                    <ul className='breadcrumb'>
                        <li className='breadcrumb-item'>
                            <a href='/dashboard'>Dashboard</a>
                        </li>
                        <li className='breadcrumb-item'>Fees Master</li>
                    </ul>
                </div>
            </div>

            <div className="row g-3">
                {/* Box 1: Class List */}
                <div className="col-md-12 p-0">
                    <div className="card ">
                        <div className="card-header bg-light">
                            <h5><i className="fa fa-school text-info"></i> Select Classes</h5>
                        </div>
                        <div className="card-body" style={{ backgroundColor: '#f4f4f4' }}>
                            <div className='row'>
                                <div className='col-3 border bg-white ' style={{ boxShadow: '0px 1px 2px 2px white' }}>
                                    <div className=''>
                                        {selectedClasses.length === 0 && (
                                            <p className="text-muted p-1 mb-1">Select class</p>
                                        )}
                                        <div style={{ display: 'grid', paddingLeft: '0px' }} className='px-2'>
                                            <h5 className='mb-1' style={{ borderBottom: "1px " }}>Class 1</h5>
                                            <h5 className='mb-1' style={{ borderBottom: "1px " }}>Class 2</h5>
                                            <h5 className='mb-1' style={{ borderBottom: "1px " }}>Class 3</h5>
                                            <h5 className='mb-1' style={{ borderBottom: "1px " }}>Class 4</h5>
                                            <h5 className='mb-1' style={{ borderBottom: "1px " }}>Class 5</h5>
                                        </div>
                                    </div>
                                    {/* <ul className="list-group">
                                        {classes.map(cls => (
                                            <li
                                                key={cls.id}
                                                className={`list-group-item p-1 border ${selectedClasses.includes(cls.id) ? 'active' : ''}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => toggleClass(cls.id)}
                                            >
                                                {cls.name}
                                            </li>
                                        ))}
                                    </ul> */}
                                </div>
                                <div className='col-4  bg-white' style={{ boxShadow: '0px 1px 2px 2px white' }}>
                                    <div className='border'>
                                        {selectedClasses.length === 0 && (
                                            <p className="text-muted p-1 mb-1">Select classes to view groups</p>
                                        )}

                                        <div style={{ display: 'grid', paddingLeft: '7px' }}>
                                            <h4>Class 1</h4>
                                            <label>
                                                <input type='checkbox' /> &nbsp;
                                                Admission Fees
                                            </label>
                                        </div>

                                    </div>
                                    {/* {selectedClasses.map(clsId => (
                                        <div key={clsId} className="mb-3">
                                            <h6 className="fw-bold">{classes.find(c => c.id === clsId)?.name}</h6>
                                            <ul className="list-group">
                                                {(feeGroups[clsId] || []).map(group => (
                                                    <li key={group.id} className="list-group-item">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input me-2"
                                                            checked={selectedGroups.includes(group.id)}
                                                            onChange={() => toggleGroup(group.id)}
                                                            id={`group-${group.id}`}
                                                        />
                                                        <label htmlFor={`group-${group.id}`}>
                                                            {group.name}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))} */}
                                </div>
                                <div className='col-4 shadow-sm'>

                                    <div>
                                        {selectedGroups.length === 0 && (
                                            <p className="text-muted">Select groups to view fee types</p>
                                        )}
                                        <label className='align-center'>
                                            <input type='checkbox' /> &nbsp;
                                            1st Installment
                                        </label>
                                    </div>
                                    {/* {selectedGroups.map(groupId => (
                                        <div key={groupId} className="mb-3">
                                            <h6 className="fw-bold">{feeGroups[selectedClasses.find(clsId =>
                                                (feeGroups[clsId] || []).some(g => g.id === groupId)
                                            )]?.find(g => g.id === groupId)?.name}</h6>
                                            <ul className="list-group">
                                                {(feeTypes[groupId] || []).map(fee => (
                                                    <li key={fee.id} className="list-group-item">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input me-2"
                                                            checked={selectedFeeTypes.includes(fee.id)}
                                                            onChange={() => toggleFeeType(fee.id)}
                                                            id={`type-${fee.id}`}
                                                        />
                                                        <label htmlFor={`type-${fee.id}`}>
                                                            {fee.type} – ₹{fee.amount} (Due: {fee.due})
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                            {/* </div> */}
                            {/* </div> */}
                            {/* </div> */}

                            {/* Box 2: Fee Groups */}
                            {/* <div className="col-md-4 p-0"> */}
                            {/* <div className="card "> */}
                            {/* <div className="card-header bg-light">
                                    <h5><i className="fa fa-layer-group text-warning"></i> Fee Groups</h5>
                                </div>
                                <div className="card-body"> */}






                            {/* </div> */}
                            {/* </div> */}
                            {/* </div> */}

                            {/* Box 3: Fee Types */}
                            {/* <div className="col-md-4 p-0"> */}
                            {/* <div className="card"> */}
                            {/* <div className="card-header bg-light">
                                    <h5><i className="fa fa-file-invoice-dollar text-success"></i> Fee Types</h5>
                                </div>
                                <div className="card-body"> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
        //     </div>
        // </div>
    );
};

export default FeesMaster;
