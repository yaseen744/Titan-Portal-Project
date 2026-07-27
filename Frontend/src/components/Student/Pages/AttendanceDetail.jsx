import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faListCheck, faUserCheck, faUserClock, faUserXmark,
  faChevronDown, faClipboardList,
} from '@fortawesome/free-solid-svg-icons'
import StudentTopbar from '../Layout/StudentTopbar.jsx'
import { attendanceOverall, attendanceByMonth, attendanceMonths } from '../data/studentData.js'

function AttendanceDetail() {
  const { openFeedback } = useOutletContext()
  const monthLabels = attendanceMonths.map((m) => m.label)
  const [selectedMonth, setSelectedMonth] = useState(monthLabels[monthLabels.length - 1])
  const [monthMenuOpen, setMonthMenuOpen] = useState(false)

  const records = attendanceByMonth[selectedMonth] || []
  const isGood = attendanceOverall.percent >= 70

  const statusClass = (status) => {
    if (status === 'Present') return 'attendance-status-present'
    if (status === 'Leave') return 'attendance-status-leave'
    return 'attendance-status-absent'
  }

  return (
    <div className="student-page">
      <StudentTopbar breadcrumb={['Home', 'WMA', 'Dashboard', 'Attendance']} onFeedbackClick={openFeedback} />

      <div className="attendance-stat-row">
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faListCheck} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{attendanceOverall.total}</span>
          <span className="attendance-stat-label">Total Classes</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserCheck} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{attendanceOverall.present}</span>
          <span className="attendance-stat-label">Present</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserClock} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{attendanceOverall.leave}</span>
          <span className="attendance-stat-label">Leave</span>
        </div>
        <div className="attendance-stat-box">
          <FontAwesomeIcon icon={faUserXmark} className="attendance-stat-icon" />
          <span className="attendance-stat-value">{attendanceOverall.absent}</span>
          <span className="attendance-stat-label">Absent</span>
        </div>
      </div>

      <div className="attendance-overview-box">
        <h4 className="attendance-overview-heading">Attendance Overview</h4>
        <div className="attendance-overview-track">
          <div
            className={`attendance-overview-fill ${isGood ? 'attendance-overview-fill-good' : 'attendance-overview-fill-bad'}`}
            style={{ width: `${attendanceOverall.percent}%` }}
          ></div>
        </div>
        <p className={`attendance-overview-message ${isGood ? 'attendance-overview-message-good' : 'attendance-overview-message-bad'}`}>
          {isGood
            ? 'Your attendance is good. Keep it up!'
            : 'Your attendance is not good. Please maintain your attendance!'}
        </p>
      </div>

      <div className="attendance-detail-box">
        <div className="attendance-detail-header">
          <span className="attendance-detail-heading">
            <FontAwesomeIcon icon={faClipboardList} /> Attendance Details
          </span>

          <div className="attendance-month-picker">
            <button type="button" className="attendance-month-btn" onClick={() => setMonthMenuOpen(!monthMenuOpen)}>
              {selectedMonth} <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {monthMenuOpen && (
              <div className="attendance-month-menu">
                {monthLabels.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="attendance-month-item"
                    onClick={() => {
                      setSelectedMonth(label)
                      setMonthMenuOpen(false)
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="attendance-table-head">
          <span>Class</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {records.length === 0 && (
          <p className="attendance-no-record">No attendance record found for this month.</p>
        )}

        {records.map((r) => (
          <div key={r.classLabel} className="attendance-table-row">
            <span className="attendance-class-label">{r.classLabel}</span>
            <span className="attendance-date-label">{r.date}</span>
            <span className={`attendance-status-chip ${statusClass(r.status)}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AttendanceDetail
