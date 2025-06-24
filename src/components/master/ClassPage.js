import React from 'react'
import Input from '../common/Input';
import ActionButton from '../common/ActionButton';


const ClassPage = () => {

    const columns = [
        { label: 'Class', name: 'class', required: true }
    ];

    return (
        <div className="">
            {/* Breadcrumb */}
            <div className="row">
                <div className="col-md-12 col-12 p-0">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item">
                            Class
                        </li>
                    </ul>
                </div>
            </div>

            <div className='row'>
                {/* class form */}
                <div className='card card-outline card-orange col-md-3 p-0'>
                    <div className="card-header bg-primary">
                        <div className="card-title">
                            <h4>
                                <i className="fa fa-street-view"></i> &nbsp;Add Class
                            </h4>
                        </div>
                        {/* <div className="card-tools">
                            <a href="/userView" className="btn btn-primary btn-sm">
                                <i className="fa fa-eye"></i>
                                <span className="Display_none_mobile"> &nbsp;View</span>
                            </a>
                        </div> */}

                    </div>
                    <div className='card-body'>
                        <div className='row'>
                            {columns.map((col) => (
                                <div className="col-sm-12" key={col.name}>
                                    <Input
                                        label={col.label}
                                        name={col.name}
                                        type={col.type || 'text'}
                                        required={col.required}
                                        pattern={col.pattern}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='col-12 p-0'>
                            <button className='btn btn-primary' type='submit'>Submit</button>
                        </div>

                    </div>
                </div>
                {/* class list */}
                <div className='col-md-9 col-9'>
                    <div className='card card-outline card-orange'>
                        <div className='card-header bg-primary '>
                            <div className='card-title'>
                                <h4><i className="fa fa-list"></i> Branch List</h4>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Class Name</th>
                                            <th>Action</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                            <tr>
                                            
                                              
                                                <td>1</td>
                                                <td>Nursery</td>
                                                <td>
                                                    <ActionButton className="btn btn-sm btn-warning mr-1" >
                                                        Edit
                                                    </ActionButton>
                                                    <ActionButton className="btn btn-sm btn-danger" >
                                                        Delete
                                                    </ActionButton>
                                                </td>
                                            </tr>
                                        {/* (
                                            <tr>
                                                <td colSpan="8" className="text-center text-muted">No branches found.</td>
                                            </tr>
                                        ) */}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClassPage;