// src/components/AcademicCalendar/CalendarView.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'; // Optional for custom styles

const CalendarView = () => {
  const [date, setDate] = useState(new Date());

  const onChange = newDate => {
    setDate(newDate);
    // You can trigger logic here (e.g., fetch events)
  };

  return (
    <div className="calendar-container">
      <h2>Academic Calendar</h2>
      <Calendar onChange={onChange} value={date} />
      <p className="selected-date">Selected Date: {date.toDateString()}</p>
    </div>
  );
};

export default CalendarView;
