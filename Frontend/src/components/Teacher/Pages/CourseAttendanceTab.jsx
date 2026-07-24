import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup, faUserCheck, faUserClock, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/axios.js'

function statusClass(status) {
  if (status === 'present') return 'attendance-status-present'
  if (status === 'leave') return 'attendance-status-leave'
  return 'attendance-status-absent'
}

function statusLabel(status) {
  if (status === 'present') return 'Present'
  if (status === 'leave') return 'Leave'
  return 'Absent'
}

function CourseAttendanceTab({ course }) {
  const today = new Date().toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = useState(today)
  const [records, setRecords] = useState([])
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, leave: 0 })

  useEffect(() => {
    api.get('/teacher/attendance', { params: { batchId: course.batchId, date: selectedDate } })
      .then(({ data }) => {
        setStats({ total: data.total, present: data.present, absent: data.absent, leave: data.leave })
        setRecords(
          (data.students || []).map((s) => ({
            id: s.studentId,
            name: s.name,
            roll: s.rollNumber,
            status: s.status,
          }))
        )
      })
      .catch((err) => console.error('Could not load attendance', err))
  }, [course.batchId, selectedDate])

  return (
    <div className="course-tab-box">
      <div className="course-attendance-date-row">
        <label className="auth-input-label" htmlFor="attendance-date">Select Date</label>
        <input
          id="attendance-date"
          type="date"
          className="course-attendance-date-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="attendance-stat-row">
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserGroup} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{stats.total}</span>
          <span className="attendance-stat-label">Total Students</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserCheck} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{stats.present}</span>
          <span className="attendance-stat-label">Present</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserClock} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{stats.leave}</span>
          <span className="attendance-stat-label">Leave</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserXmark} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{stats.absent}</span>
          <span className="attendance-stat-label">Absent</span>
        </div>
      </div>

      <div className="student-row-head course-attendance-row-head">
        <span>Name</span>
        <span>Roll No</span>
        <span>Status</span>
      </div>

      {records.map((r) => (
        <div key={r.id} className="student-row course-attendance-row">
          <span className="student-row-name">{r.name}</span>
          <span>{r.roll}</span>
          <span className={`attendance-status-chip ${statusClass(r.status)}`}>{statusLabel(r.status)}</span>
        </div>
      ))}
    </div>
  )
}

export default CourseAttendanceTab
