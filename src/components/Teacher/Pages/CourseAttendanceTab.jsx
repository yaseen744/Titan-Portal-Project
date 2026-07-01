import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup, faUserCheck, faUserClock, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import { getStudentsForCourse, getCourseAttendanceForDate } from '../data/teacherData.js'

function statusClass(status) {
  if (status === 'Present') return 'attendance-status-present'
  if (status === 'Leave') return 'attendance-status-leave'
  return 'attendance-status-absent'
}

function CourseAttendanceTab({ course }) {
  const [selectedDate, setSelectedDate] = useState('2026-06-17')
  const students = useMemo(() => getStudentsForCourse(course), [course])

  const dayOfMonth = new Date(selectedDate).getDate()
  const records = useMemo(() => getCourseAttendanceForDate(students, dayOfMonth), [students, dayOfMonth])

  const total = records.length
  const present = records.filter((r) => r.status === 'Present').length
  const leave = records.filter((r) => r.status === 'Leave').length
  const absent = records.filter((r) => r.status === 'Absent').length

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
          <span className="attendance-stat-value">{total}</span>
          <span className="attendance-stat-label">Total Students</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserCheck} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{present}</span>
          <span className="attendance-stat-label">Present</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserClock} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{leave}</span>
          <span className="attendance-stat-label">Leave</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserXmark} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{absent}</span>
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
          <span className={`attendance-status-chip ${statusClass(r.status)}`}>{r.status}</span>
        </div>
      ))}
    </div>
  )
}

export default CourseAttendanceTab
