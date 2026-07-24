import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faClock, faHourglassHalf, faClockRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import TeacherTopbar from '../Layout/TeacherTopbar.jsx'
import api from '../../../api/axios.js'

function monthLabelsFromToday(count = 9) {
  const labels = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(d.toLocaleString('default', { month: 'long', year: 'numeric' }))
  }
  return labels
}

function TeacherAttendance() {
  const [courses, setCourses] = useState([])
  const [courseOpen, setCourseOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [view, setView] = useState('Overall')
  const [overview, setOverview] = useState({ totalClasses: 0, present: 0, totalLateMinutes: 0, records: [] })
  const monthLabels = monthLabelsFromToday()
  const [monthOpen, setMonthOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(monthLabels[0])

  useEffect(() => {
    api.get('/teacher/courses')
      .then(({ data }) => {
        setCourses(data.courses || [])
        if (data.courses?.length) setSelectedCourse(data.courses[0])
      })
      .catch((err) => console.error('Could not load courses', err))
  }, [])

  useEffect(() => {
    const batchId = view === 'Overall' ? 'all' : selectedCourse?._id
    if (view === 'This Slot' && !selectedCourse) return
    api.get('/teacher/attendance/overview', { params: { batchId } })
      .then(({ data }) => setOverview(data))
      .catch((err) => console.error('Could not load attendance overview', err))
  }, [view, selectedCourse])

  const filteredRecords = overview.records.filter((r) => {
    const label = new Date(r.date).toLocaleString('default', { month: 'long', year: 'numeric' })
    return label === selectedMonth
  })
  const filteredPresent = filteredRecords.filter((r) => r.status === 'present').length
  const filteredLate = filteredRecords.reduce((sum, r) => sum + (r.lateMinutes || 0), 0)

  if (!selectedCourse) {
    return (
      <div className="teacher-page">
        <TeacherTopbar breadcrumb={['Home', 'Attendance']} />
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="teacher-page">
      <TeacherTopbar breadcrumb={['Home', 'Attendance']} />

      <div className="teacher-attendance-top-row">
        <h4 className="teacher-attendance-heading">Attendance</h4>

        <div className="attendance-month-picker">
          <button type="button" className="attendance-month-btn" onClick={() => setCourseOpen(!courseOpen)}>
            {selectedCourse.courseName} ({selectedCourse.batchNumber}) <FontAwesomeIcon icon={faChevronDown} />
          </button>
          {courseOpen && (
            <div className="attendance-month-menu teacher-course-picker-menu">
              {courses.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  className="attendance-month-item"
                  onClick={() => {
                    setSelectedCourse(c)
                    setCourseOpen(false)
                  }}
                >
                  {c.courseName} ({c.batchNumber})
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
                    setSelectedMonth(label)
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
          <span className="attendance-stat-value">{filteredRecords.length}</span>
          <span className="attendance-stat-label">Total Classes</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faHourglassHalf} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{filteredPresent}</span>
          <span className="attendance-stat-label">Present Records</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faClockRotateLeft} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{filteredLate} min</span>
          <span className="attendance-stat-label">Total Late Time</span>
        </div>
      </div>

      <h5 className="teacher-attendance-records-heading">Attendance Records</h5>
      <p className="teacher-attendance-course-label">
        Course: {view === 'Overall' ? 'All Courses' : `${selectedCourse.courseName} (${selectedCourse.batchNumber})`}
      </p>

      {filteredRecords.length === 0 ? (
        <div className="teacher-no-record-box">
          <FontAwesomeIcon icon={faCircleInfo} className="teacher-no-record-icon" />
          <p>No Attendance Record Found</p>
        </div>
      ) : (
        <div className="student-row-head course-attendance-row-head">
          <span>Student</span>
          <span>Date</span>
          <span>Status</span>
        </div>
      )}

      {filteredRecords.map((r, idx) => (
        <div key={idx} className="student-row course-attendance-row">
          <span className="student-row-name">{r.studentName} ({r.rollNumber})</span>
          <span>{new Date(r.date).toLocaleDateString()}</span>
          <span className={`attendance-status-chip attendance-status-${r.status}`}>{r.status}</span>
        </div>
      ))}
    </div>
  )
}

export default TeacherAttendance
