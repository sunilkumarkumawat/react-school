import React, { useState } from 'react';
import axios from 'axios';

function AcademicCalendar({ year, month, monthData = [], apiUrl }) {
    const [events, setEvents] = useState(monthData);
    const [newRows, setNewRows] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const handleDateClick = (dateStr, e) => {
        if (e.ctrlKey || e.metaKey) {
            // Handle multiple date selection
            if (selectedDates.includes(dateStr)) {
                setSelectedDates(selectedDates.filter(d => d !== dateStr));
            } else {
                setSelectedDates([...selectedDates, dateStr]);
            }
        } else {
            // Check if date is already part of a new merged block
            const isInNewRow = newRows.some(row => {
                const current = new Date(dateStr);
                const start = new Date(row.start_date);
                const end = new Date(row.end_date);
                return current >= start && current <= end;
            });

            if (isInNewRow) return; // ✅ Do not allow appending again

            // Append new single-day row
            setNewRows((prev) => [...prev, { start_date: dateStr, end_date: dateStr, name: '', description: '', color: '#ffd700' }]);
        }
    };

    const groupContinuousDates = (dates) => {
        const sorted = [...dates].sort();
        const groups = [];

        let group = [sorted[0]];

        for (let i = 1; i < sorted.length; i++) {
            const current = new Date(sorted[i]);
            const previous = new Date(sorted[i - 1]);

            const diff = (current - previous) / (1000 * 60 * 60 * 24);

            if (diff === 1) {
                group.push(sorted[i]);
            } else {
                groups.push([...group]);
                group = [sorted[i]];
            }
        }
        groups.push([...group]);
        return groups;
    };

    const handleMergeDates = () => {
        if (selectedDates.length === 0) return;

        const groups = groupContinuousDates(selectedDates);

        const mergedRows = groups.map(group => {
            const sortedGroup = [...group].sort();
            return {
                start_date: sortedGroup[0],
                end_date: sortedGroup[sortedGroup.length - 1],
                name: '',
                description: '',
                color: '#ffd700',
            };
        });

        setNewRows(prev => [...prev, ...mergedRows]);
        setSelectedDates([]);
    };

    const handleInputChange = (index, field, value) => {
        const updated = [...newRows];
        updated[index][field] = value;
        setNewRows(updated);
    };

    const handleEditExisting = (index, field, value) => {
        const updated = [...events];
        updated[index][field] = value;
        setEvents(updated);
    };

    const handleDeleteExisting = async (eventToDelete) => {
        if (!window.confirm(`Delete "${eventToDelete.name}"?`)) return;

        try {
            await axios.delete(`${apiUrl}/${eventToDelete.id}`);
            setEvents((prev) => prev.filter(e => e.id !== eventToDelete.id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Could not delete event.");
        }
    };

    const handleRemoveNewRow = (index) => {
        setNewRows((prev) => prev.filter((_, i) => i !== index));
    };

    const days = getDaysInMonth(year, month);
    const firstDayOfWeek = days[0].getDay();

    const getDateStyle = (dateStr) => {
        const currentDate = new Date(dateStr);
        const isSunday = currentDate.getDay() === 0; // Sunday = 0

        const style = {
            border: '1px solid #ccc',
            padding: '6px',
            cursor: 'pointer',
            minHeight: '32px',
            backgroundColor: isSunday ? '#f0f0f0' : '#fff', // 🩶 Light grey for Sundays
        };

        // Highlight new rows
        const newMatch = newRows.find(e => {
            const start = new Date(e.start_date);
            const end = new Date(e.end_date);
            return currentDate >= start && currentDate <= end;
        });

        if (newMatch) {
            style.backgroundColor = newMatch.color || '#ffd700';
        }

        // Highlight saved events
        const matchingEvent = events.find(e => {
            const start = new Date(e.start_date || e.date);
            const end = new Date(e.end_date || e.date);
            return currentDate >= start && currentDate <= end;
        });

        if (matchingEvent) {
            style.backgroundColor = matchingEvent.color;
        }

        // Highlight selected
        if (selectedDates.includes(dateStr)) {
            style.border = '2px solid #007bff';
        }

        // Disable interaction visuals
        if (isDateUsed(dateStr)) {
            style.pointerEvents = 'none';
            style.opacity = 1;
        }

        return style;
    };


    const isDateUsed = (dateStr) => {
        const current = new Date(dateStr);

        // Check existing events
        const usedInEvents = events.some(e => {
            const start = new Date(e.start_date || e.date);
            const end = new Date(e.end_date || e.date);
            return current >= start && current <= end;
        });

        // Check new rows
        const usedInNew = newRows.some(e => {
            const start = new Date(e.start_date);
            const end = new Date(e.end_date);
            return current >= start && current <= end;
        });

        // Check ctrl-selected dates
        const usedInSelected = selectedDates.includes(dateStr);

        return usedInEvents || usedInNew || usedInSelected;
    };

    const hasSequentialDates = (dates) => {
        if (dates.length < 2) return false;

        const sorted = dates
            .map(d => new Date(d))
            .sort((a, b) => a - b);

        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1];
            const curr = sorted[i];
            const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diffDays !== 1) return false; // Breaks sequence
        }
        return true;
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ border: '2px solid #ccd3da' }}>
                <h3 className='bg-light text-center mb-0' style={{fontSize: '15px'}}>{`${monthNames[month]} - ${year}`}</h3>
                <div className='text-center p-1' style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', fontWeight: 'bold', backgroundColor: 'rgb(255, 255, 255)', color: '#002C54', fontWeight: '700' }} >
                    {['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {[...Array(firstDayOfWeek)].map((_, i) => <div key={i}></div>)}
                    {days.map((dateObj) => {
                        const dateStr = dateObj.getFullYear() + '-' +
                            String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
                            String(dateObj.getDate()).padStart(2, '0');
                        return (
                            <div
                                key={dateStr}
                                onClick={(e) => {
                                    if (!isDateUsed(dateStr)) {
                                        handleDateClick(dateStr, e);
                                    }
                                }}
                                style={{
                                    ...getDateStyle(dateStr),
                                    pointerEvents: isDateUsed(dateStr) ? 'none' : 'auto',
                                    opacity: isDateUsed(dateStr) ? 0.5 : 1,
                                }}
                            >
                                <strong>{dateObj.getDate()}</strong>
                            </div>
                        );
                    })}
                </div>
                {hasSequentialDates(selectedDates) && (
                    <button
                        style={{ margin: '10px 0', padding: '6px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
                        onClick={handleMergeDates}
                    >
                        Merge Selected Dates
                    </button>
                )}
            </div>

            <div style={{ flex: 1 }}>
                {/* <h3>{`${monthNames[month]}`}</h3> */}
                <table className='table table-striped table-bordered' style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgb(0, 44, 84)', color: 'white' }}>
                            <th>Sr No</th>
                            <th>Date(s)</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events
                            .filter((e) => {
                                const start = new Date(e.start_date);
                                const end = new Date(e.end_date || e.start_date);
                                return (
                                    (start.getFullYear() === year && start.getMonth() === month) ||
                                    (end.getFullYear() === year && end.getMonth() === month)
                                );
                            })
                            .map((e, i) => (
                                <tr key={`event-${i}`}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={
                                                e.start_date === e.end_date || !e.end_date
                                                    ? e.start_date
                                                    : `${e.start_date} to ${e.end_date}`
                                            }
                                            readOnly
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={e.name}
                                            onChange={(ev) => handleEditExisting(i, 'name', ev.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={e.description}
                                            onChange={(ev) =>
                                                handleEditExisting(i, 'description', ev.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="color"
                                            value={e.color || '#cccccc'}
                                            onChange={(ev) => handleEditExisting(i, 'color', ev.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteExisting(e)}
                                            style={{ color: 'red' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        {newRows.map((row, index) => (
                            <tr key={`new-${index}`}>
                                <td>{events.length + index + 1}</td>
                                <td>{row.start_date === row.end_date ? row.start_date : `${row.start_date} to ${row.end_date}`}</td>
                                <td><input value={row.name} onChange={(e) => handleInputChange(index, 'name', e.target.value)} /></td>
                                <td><input value={row.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} /></td>
                                <td>
                                    <input
                                        type="color"
                                        value={row.color || '#ffd700'}
                                        onChange={(e) => handleInputChange(index, 'color', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => handleRemoveNewRow(index)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AcademicCalendar;