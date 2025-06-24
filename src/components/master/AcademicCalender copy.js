import React, { useState } from 'react';
import axios from 'axios';

function AcademicCalendar({ year, month, monthData = [], apiUrl }) {
    const [events, setEvents] = useState(monthData);
    const [newRows, setNewRows] = useState([]);

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const handleDateClick = (dateStr) => {
        if (!newRows.some((row) => row.date === dateStr)) {
            setNewRows((prev) => [...prev, { date: dateStr, name: '', description: '' }]);
        }
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
    const handleUpdateExisting = async (index) => {
        const event = events[index];
        try {
            await axios.put(`${apiUrl}/${event.id}`, event);
            alert('Event updated successfully');
        } catch (err) {
            console.error('Update failed', err);
            alert('Could not update event');
        }
    };
    const handleRemoveNewRow = (index) => {
        setNewRows((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        const rowsToSave = newRows.filter((row) => row.name.trim());

        if (rowsToSave.length === 0) return alert("Please fill at least one event name.");

        try {
            const responses = await Promise.all(rowsToSave.map(row => axios.post(apiUrl, row)));
            const saved = responses.map(res => res.data);
            setEvents((prev) => [...prev, ...saved]);
            setNewRows([]);
            alert("Events saved successfully.");
        } catch (err) {
            console.error("Save failed", err);
            alert("Error saving events.");
        }
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

    const days = getDaysInMonth(year, month);
    const firstDayOfWeek = days[0].getDay();

    const getDateStyle = (dateStr) => {
        const matchingEvent = events.find(e => e.date === dateStr);
        const isNew = newRows.some(r => r.date === dateStr);

        let style = {
            border: isNew ? '2px solid #007bff' : '1px solid #ccc',
            padding: '8px',
            cursor: 'pointer',
            minHeight: '50px',
            backgroundColor: '#fff',
        };

        if (matchingEvent && matchingEvent.color) {
            style.backgroundColor = matchingEvent.color;
        }

        return style;
    };

    return (
        <div style={{ display: 'flex', gap: '30px' }}>
            {/* Calendar */}
            <div style={{ flex: 1 }}>
                <h3>{`${year} - ${month + 1}`}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', fontWeight: 'bold' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                    {[...Array(firstDayOfWeek)].map((_, i) => <div key={i}></div>)}
                    {days.map((dateObj) => {
                        const dateStr = dateObj.getFullYear() + '-' +
                            String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
                            String(dateObj.getDate()).padStart(2, '0');
                        return (
                            <div
                                key={dateStr}
                                onClick={() => handleDateClick(dateStr)}
                                style={getDateStyle(dateStr)}
                            >
                                <strong>{dateObj.getDate()}</strong>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Events Panel */}
            <div style={{ flex: 1 }}>
                <h3>Events - {year}-{String(month + 1).padStart(2, '0')}</h3>
                <table className='table table-striped' style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgb(0, 44, 84)', color: 'white' }}>
                            <th>Sr No</th>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Existing Events */}
                        {events
                            .filter(e => new Date(e.date).getMonth() === month && new Date(e.date).getFullYear() === year)
                            .map((e, i) => (
                                <tr key={`event-${i}`}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <input
                                            type="date"
                                            value={e.date}
                                            onChange={(ev) => handleEditExisting(i, 'date', ev.target.value)}
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={e.name}
                                            onChange={(ev) => handleEditExisting(i, 'name', ev.target.value)}
                                            placeholder="Name"
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={e.description}
                                            onChange={(ev) => handleEditExisting(i, 'description', ev.target.value)}
                                            placeholder="Description"
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="color"
                                            value={e.color || '#cccccc'}
                                            onChange={(ev) => handleEditExisting(i, 'color', ev.target.value)}
                                        />
                                        <span style={{ marginLeft: '8px' }}>{e.color || '#cccccc'}</span>
                                    </td>
                                    <td>
                                        {/* <button onClick={() => handleUpdateExisting(i)} style={{ marginRight: '5px', color: 'green' }}>
                                            Save
                                        </button> */}
                                        <button onClick={() => handleDeleteExisting(e)} style={{ color: 'red' }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        {/* New Rows */}
                        {newRows.map((row, index) => (
                            <tr key={`new-${index}`}>
                                <td>{events.length + index + 1}</td>
                                <td>{row.date}</td>
                                <td>
                                    <input value={row.name} onChange={(e) => handleInputChange(index, 'name', e.target.value)} />
                                </td>
                                <td>
                                    <input value={row.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} />
                                </td>
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

                {newRows.length > 0 && (
                    <button
                        style={{ marginTop: '10px', padding: '8px 16px' }}
                        onClick={handleSave}
                    >
                        Save All
                    </button>
                )}
            </div>
        </div>
    );
}

export default AcademicCalendar;
