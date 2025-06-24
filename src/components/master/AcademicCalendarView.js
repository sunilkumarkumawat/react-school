import React from 'react'
import Input from '../common/Input';
import ActionButton from '../common/ActionButton';
import AcademicCalendar from './AcademicCalender';

const dummyEvents = [
  // January
  { id: 1, start_date: '2025-01-01', end_date: '2025-01-01', name: 'New Year', description: 'Welcome the new year', color: '#ffe0b2' },

  // February
  { id: 2, start_date: '2025-02-14', end_date: '2025-02-14', name: 'Valentine\'s Day', description: '', color: '#f8bbd0' },

  // March
  { id: 3, start_date: '2025-03-20', end_date: '2025-03-22', name: 'Cultural Fest', description: '3-day celebration', color: '#d1c4e9' },

  // April
  { id: 4, start_date: '2025-04-07', end_date: '2025-04-07', name: 'World Health Day', description: '', color: '#b2dfdb' },

  // May
  { id: 5, start_date: '2025-05-01', end_date: '2025-05-01', name: 'Labour Day', description: '', color: '#cfd8dc' },

  // June
  { id: 6, start_date: '2025-06-10', end_date: '2025-06-10', name: 'Environment Day', description: 'Plant trees', color: '#c8e6c9' },
  { id: 7, start_date: '2025-06-21', end_date: '2025-06-21', name: 'Yoga Day', description: '', color: '#b3e5fc' },
  { id: 8, start_date: '2025-06-11', end_date: '2025-06-13', name: 'Science Fair', description: 'Exhibition of student projects', color: '#ffcdd2' },

  // July
  { id: 9, start_date: '2025-07-04', end_date: '2025-07-04', name: 'Workshop Day', description: '', color: '#ffe082' },

  // August
  { id: 10, start_date: '2025-08-15', end_date: '2025-08-15', name: 'Independence Day', description: '', color: '#c5e1a5' },

  // September
  { id: 11, start_date: '2025-09-05', end_date: '2025-09-05', name: 'Teacher\'s Day', description: '', color: '#f0f4c3' },

  // October
  { id: 12, start_date: '2025-10-02', end_date: '2025-10-02', name: 'Gandhi Jayanti', description: '', color: '#fff9c4' },

  // November
  { id: 13, start_date: '2025-11-14', end_date: '2025-11-14', name: 'Children\'s Day', description: '', color: '#dcedc8' },

  // December
  { id: 14, start_date: '2025-12-25', end_date: '2025-12-25', name: 'Christmas', description: '', color: '#f8bbd0' }
];


const AcademicCalendarView = () => {

  return (

    <div className="container">
      <div className="row">
        {[...Array(12)].map((_, monthIndex) => (
          <div className="col-12 col-md-12 mb-4" key={monthIndex}>
            <AcademicCalendar
              year={2025}
              month={monthIndex}
              monthData={dummyEvents}
              apiUrl="/your-api-url"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicCalendarView;