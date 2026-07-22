import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faClock, faHourglassHalf, faClockRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import TeacherTopbar from '../Layout/TeacherTopbar.jsx'
import { courses, teacherAttendanceMonths } from '../data/teacherData.js'

function TeacherAttendance() {
  const [courseOpen, setCourseOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(courses[2]) // Modern Web App Dev Batch-1
  const [view, setView] = useState('Overall')
  const monthLabels = teacherAttendanceMonths.map((m) => m.label)
  const [monthOpen, setMonthOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('1 Jun 2026 to 1 Jul 2026')

  return (
    <div className="teacher-page">
      <TeacherTopbar breadcrumb={['Home', 'Attendance']} />

      <div className="teacher-attendance-top-row">
        <h4 className="teacher-attendance-heading">Attendance</h4>

        <div className="attendance-month-picker">
          <button type="button" className="attendance-month-btn" onClick={() => setCourseOpen(!courseOpen)}>
            {selectedCourse.title} ({selectedCourse.batchLabel}) <FontAwesomeIcon icon={faChevronDown} />
          </button>
          {courseOpen && (
            <div className="attendance-month-menu teacher-course-picker-menu">
              {courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="attendance-month-item"
                  onClick={() => {
                    setSelectedCourse(c)
                    setCourseOpen(false)
                  }}
                >
                  {c.title} ({c.batchLabel})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="teacher-overall-stats-label">Overall Stats</p>

      <div className="teacher-attendance-controls-row">
        <div className="attendance-month-picker">
          <button type="button" className="attendance-month-btn" onClick={() => setMonthOpen(!monthOpen)}>
            {selectedMonth} <FontAwesomeIcon icon={faChevronDown} />
          </button>
          {monthOpen && (
            <div className="attendance-month-menu">
              {monthLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="attendance-month-item"
                  onClick={() => {
                    setSelectedMonth(`1 ${label} to End`)
                    setMonthOpen(false)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="teacher-view-toggle-group">
          <button
            type="button"
            className={`teacher-view-toggle-btn ${view === 'Overall' ? 'teacher-view-toggle-btn-active' : ''}`}
            onClick={() => setView('Overall')}
          >
            Overall
          </button>
          <button
            type="button"
            className={`teacher-view-toggle-btn ${view === 'This Slot' ? 'teacher-view-toggle-btn-active' : ''}`}
            onClick={() => setView('This Slot')}
          >
            This Slot
          </button>
        </div>
      </div>

      <div className="attendance-stat-row">
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faClock} className="attendance-stat-icon" />
          <span className="attendance-stat-value">0</span>
          <span className="attendance-stat-label">Total Classes</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faHourglassHalf} className="attendance-stat-icon" />
          <span className="attendance-stat-value">0 min</span>
          <span className="attendance-stat-label">Total Time Survived</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faClockRotateLeft} className="attendance-stat-icon" />
          <span className="attendance-stat-value">0 min</span>
          <span className="attendance-stat-label">Total Late Time</span>
        </div>
      </div>

      <h5 className="teacher-attendance-records-heading">Attendance Records</h5>
      <p className="teacher-attendance-course-label">Course: {selectedCourse.title} ({selectedCourse.batchLabel})</p>

      <div className="teacher-no-record-box">
        <FontAwesomeIcon icon={faCircleInfo} className="teacher-no-record-icon" />
        <p>No Attendance Record Found</p>
      </div>
    </div>
  )
}

export default TeacherAttendance
