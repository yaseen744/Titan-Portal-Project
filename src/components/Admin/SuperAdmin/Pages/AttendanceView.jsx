import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUserCheck, faUserClock, faUserXmark, faListCheck } from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import { findStudentByRoll, getStudentAttendanceCalendar } from '../data/superAdminData.js'

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const YEAR = 2026
const MONTH = 5 // June

function buildGrid(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function statusClass(status) {
  if (status === 'Present') return 'calendar-day-present'
  if (status === 'Leave') return 'calendar-day-leave'
  return 'calendar-day-absent'
}

function AttendanceView() {
  const [rollInput, setRollInput] = useState('')
  const [student, setStudent] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const s = findStudentByRoll(rollInput.trim())
    setStudent(s || null)
    setNotFound(!s)
  }

  const calendar = student ? getStudentAttendanceCalendar(student, YEAR, MONTH) : null
  const cells = buildGrid(YEAR, MONTH)

  return (
    <div className="superadmin-page">
      <SuperAdminTopbar breadcrumb={['Home', 'Attendance', 'View Attendance']} />

      <form className="attendance-mark-search-box" onSubmit={handleSearch}>
        <input
          type="text"
          className="auth-input attendance-mark-input"
          placeholder="Search by roll number..."
          value={rollInput}
          onChange={(e) => setRollInput(e.target.value)}
        />
        <button type="submit" className="auth-btn-primary attendance-mark-search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
        </button>
      </form>

      {notFound && <p className="attendance-mark-not-found">No student found with that roll number.</p>}

      {student && calendar && (
        <>
          <div className="attendance-mark-preview-box">
            <Avatar name={student.name} className="attendance-mark-avatar" />
            <div className="attendance-mark-preview-details">
              <h4 className="attendance-mark-preview-name">{student.name}</h4>
              <p className="attendance-mark-preview-line">Roll: {student.roll} &nbsp;|&nbsp; {student.course} ({student.batch})</p>
            </div>
          </div>

          <div className="attendance-stat-row">
            <div className="attendance-stat-box">
              <FontAwesomeIcon icon={faListCheck} className="attendance-stat-icon" />
              <span className="attendance-stat-value">{calendar.percent}%</span>
              <span className="attendance-stat-label">Attendance</span>
            </div>
            <div className="attendance-stat-box">
              <FontAwesomeIcon icon={faUserCheck} className="attendance-stat-icon" />
              <span className="attendance-stat-value">{calendar.present}</span>
              <span className="attendance-stat-label">Present</span>
            </div>
            <div className="attendance-stat-box">
              <FontAwesomeIcon icon={faUserClock} className="attendance-stat-icon" />
              <span className="attendance-stat-value">{calendar.leave}</span>
              <span className="attendance-stat-label">Leave</span>
            </div>
            <div className="attendance-stat-box">
              <FontAwesomeIcon icon={faUserXmark} className="attendance-stat-icon" />
              <span className="attendance-stat-value">{calendar.absent}</span>
              <span className="attendance-stat-label">Absent</span>
            </div>
          </div>

          <div className="calendar-box">
            <h4 className="superadmin-chart-title" style={{ marginBottom: 14 }}>June 2026</h4>
            <div className="calendar-weekday-row">
              {weekdayLabels.map((w) => <span key={w} className="calendar-weekday-label">{w}</span>)}
            </div>
            <div className="calendar-grid">
              {cells.map((day, idx) => {
                const status = day ? calendar.days[day] : null
                return (
                  <div key={idx} className={`calendar-cell ${day === null ? 'calendar-cell-empty' : ''} ${status ? statusClass(status) : ''}`}>
                    {day && <span className="calendar-cell-day">{day}</span>}
                    {status && <span className="calendar-day-status-label">{status}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AttendanceView
