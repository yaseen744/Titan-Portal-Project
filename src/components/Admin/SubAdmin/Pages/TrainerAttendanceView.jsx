import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import SubAdminTopbar from '../Layout/SubAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import { trainers } from '../data/subAdminData.js'

// Deterministic static check-in/out times for the demo
function timeForTrainer(seed, base) {
  const mins = (seed * 7) % 20
  const hour = base + Math.floor(mins / 60)
  const min = mins % 60
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

function TrainerAttendanceView() {
  const [date, setDate] = useState('2026-06-20')

  return (
    <div className="subadmin-page">
      <SubAdminTopbar breadcrumb={['Home', 'Trainers', 'Attendance', 'View Attendance']} />

      <div className="course-attendance-date-row">
        <label className="auth-input-label" htmlFor="trainer-att-date">
          <FontAwesomeIcon icon={faCalendarDay} /> Select Date
        </label>
        <input
          id="trainer-att-date"
          type="date"
          className="course-attendance-date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="course-tab-box">
        <div className="student-row-head trainer-attendance-row-head">
          <span>Photo</span>
          <span>Trainer</span>
          <span>Check In</span>
          <span>Check Out</span>
          <span>Status</span>
        </div>
        {trainers.map((t, idx) => (
          <div key={t.id} className="student-row trainer-attendance-row">
            <Avatar name={t.name} className="student-row-photo" />
            <span className="student-row-name">{t.name}</span>
            <span>{timeForTrainer(idx + 1, 13)} PM</span>
            <span>{timeForTrainer(idx + 5, 15)} PM</span>
            <span className="attendance-status-chip attendance-status-present">Present</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrainerAttendanceView
