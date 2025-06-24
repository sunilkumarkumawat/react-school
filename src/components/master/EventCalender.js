import React from "react";
import Input from "../common/Input";

const EventCalender = () => {

    const columns = [
        { label: 'Date', name: 'date', type: 'date' },
        { label: 'Event/Schedule', name: 'event', type: 'text' },
        { label: 'Attendance status for that day', name: 'attendence', type : 'select', Options: [{ label: 'In', value: 'In' }, { label: 'Out', value: 'Out' }, { label: 'Holiday', value: 'Holiday' }, { label: 'Absent', value: 'Absent' }, { label: 'Leave', value: 'Leave' }, { label: 'Event', value: 'Event' }, { label: 'Exam', value: 'Exam' }] }

    ];
    return (
        <div className="">
            <div className="row">
                {/* Bread crumb */}
                <div className="col-md-12 col-12">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item">
                            Calendar
                        </li>
                    </ul>
                </div>
            </div>

            {/* calender form */}
            <div className="row">
                <div className="col-md-12 col-9">
                    <div className="card card-orange card-outline">
                        <div className="card-header bg-primary">
                            <div className="card-title">
                                <h4>
                                    <i class="fa-solid fa-calendar-plus"></i> &nbsp;Weekend Calender Add
                                </h4>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="#">
                                <div className="row">
                                    {columns.map((col) => (
                                        <div className="col-sm-3">
                                            <Input
                                                label={col.label}
                                                name={col.name}
                                                type={col.type || 'select'}
                                                required={col.required}
                                                pattern={col.pattern}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default EventCalender;
