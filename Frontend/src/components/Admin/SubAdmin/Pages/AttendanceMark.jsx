import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBarcode, faMagnifyingGlass, faCircleCheck, faTriangleExclamation, faClipboardList,
} from '@fortawesome/free-solid-svg-icons'
import SubAdminTopbar from '../Layout/SubAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import { findStudentByRoll } from '../data/subAdminData.js'

function AttendanceMark() {
  const [rollInput, setRollInput] = useState('')
  const [found, setFound] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [markedToday, setMarkedToday] = useState([])
  const [justMarked, setJustMarked] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setJustMarked(false)
    const student = findStudentByRoll(rollInput.trim())
    if (student) {
      setFound(student)
      setNotFound(false)
    } else {
      setFound(null)
      setNotFound(true)
    }
  }

  const alreadyMarked = found && markedToday.includes(found.roll)

  const handleMark = () => {
    if (!found || alreadyMarked) return
    setMarkedToday([found.roll, ...markedToday])
    setJustMarked(true)
  }

  return (
    <div className="subadmin-page">
      <SubAdminTopbar breadcrumb={['Home', 'Attendance', 'Mark Attendance']} />

      <form className="attendance-mark-search-box" onSubmit={handleSearch}>
        <FontAwesomeIcon icon={faBarcode} className="attendance-mark-scan-icon" />
        <input
          type="text"
          className="auth-input attendance-mark-input"
          placeholder="Type or scan roll number..."
          value={rollInput}
          onChange={(e) => setRollInput(e.target.value)}
        />
        <button type="submit" className="auth-btn-primary attendance-mark-search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} /> Find
        </button>
      </form>

      {notFound && <p className="attendance-mark-not-found">No student found with that roll number.</p>}

      {found && (
        <div className="attendance-mark-preview-box">
          <Avatar name={found.name} className="attendance-mark-avatar" />
          <div className="attendance-mark-preview-details">
            <h4 className="attendance-mark-preview-name">{found.name}</h4>
            <p className="attendance-mark-preview-line">Roll: {found.roll} &nbsp;|&nbsp; {found.course} ({found.batch})</p>
            <p className="attendance-mark-preview-line">Campus: {found.campus}</p>
            {found.paymentStatus !== 'Paid' && (
              <p className="attendance-mark-payment-warning">
                <FontAwesomeIcon icon={faTriangleExclamation} /> This student hasn't paid yet — marking attendance is still allowed.
              </p>
            )}
          </div>

          {justMarked ? (
            <span className="attendance-mark-marked-badge">
              <FontAwesomeIcon icon={faCircleCheck} /> Attendance Marked
            </span>
          ) : (
            <button
              type="button"
              className="auth-btn-primary attendance-mark-btn"
              disabled={alreadyMarked}
              onClick={handleMark}
            >
              <FontAwesomeIcon icon={faCircleCheck} /> {alreadyMarked ? 'Already Marked' : 'Mark Present'}
            </button>
          )}
        </div>
      )}

      <h4 className="student-form-section-heading">
        <FontAwesomeIcon icon={faClipboardList} /> Recently Marked
      </h4>
      <div className="course-tab-box">
        {markedToday.length === 0 && <p className="attendance-no-record">No attendance marked yet in this session.</p>}
        {markedToday.map((roll) => {
          const s = findStudentByRoll(roll)
          return (
            <div key={roll} className="student-detail-row">
              <span>{s?.name} ({roll})</span>
              <span className="attendance-status-chip attendance-status-present">Present</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AttendanceMark
