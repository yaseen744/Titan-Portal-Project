import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdBadge, faMagnifyingGlass, faRightToBracket, faRightFromBracket, faClock } from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import { trainers } from '../data/superAdminData.js'

function TrainerAttendanceMark() {
  const [idInput, setIdInput] = useState('')
  const [found, setFound] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [log, setLog] = useState([])

  const handleSearch = (e) => {
    e.preventDefault()
    const t = trainers.find((tr) => tr.employeeId === idInput.trim())
    setFound(t || null)
    setNotFound(!t)
  }

  const recordEvent = (type) => {
    if (!found) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setLog([{ trainer: found.name, type, time }, ...log])
  }

  return (
    <div className="superadmin-page">
      <SuperAdminTopbar breadcrumb={['Home', 'Trainers', 'Attendance', 'Mark Attendance']} />

      <form className="attendance-mark-search-box" onSubmit={handleSearch}>
        <FontAwesomeIcon icon={faIdBadge} className="attendance-mark-scan-icon" />
        <input
          type="text"
          className="auth-input attendance-mark-input"
          placeholder="Scan or type Employee ID..."
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
        />
        <button type="submit" className="auth-btn-primary attendance-mark-search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} /> Find
        </button>
      </form>

      {notFound && <p className="attendance-mark-not-found">No trainer found with that Employee ID.</p>}

      {found && (
        <div className="attendance-mark-preview-box">
          <Avatar name={found.name} className="attendance-mark-avatar" />
          <div className="attendance-mark-preview-details">
            <h4 className="attendance-mark-preview-name">{found.name}</h4>
            <p className="attendance-mark-preview-line">Employee ID: {found.employeeId} &nbsp;|&nbsp; {found.campus}</p>
          </div>
          <div className="trainer-checkin-btn-row">
            <button type="button" className="auth-btn-primary" onClick={() => recordEvent('Check-in')}>
              <FontAwesomeIcon icon={faRightToBracket} /> Check In
            </button>
            <button type="button" className="auth-btn-secondary trainer-checkout-btn" onClick={() => recordEvent('Check-out')}>
              <FontAwesomeIcon icon={faRightFromBracket} /> Check Out
            </button>
          </div>
        </div>
      )}

      <h4 className="student-form-section-heading">
        <FontAwesomeIcon icon={faClock} /> Today's Log
      </h4>
      <div className="course-tab-box">
        {log.length === 0 && <p className="attendance-no-record">No check-in/check-out recorded yet in this session.</p>}
        {log.map((l, idx) => (
          <div key={idx} className="student-detail-row">
            <span>{l.trainer}</span>
            <span>{l.type} at {l.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrainerAttendanceMark
