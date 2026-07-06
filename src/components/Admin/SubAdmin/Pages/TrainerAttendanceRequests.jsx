import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import SubAdminTopbar from '../Layout/SubAdminTopbar.jsx'
import { trainerAttendanceRequests as initialRequests } from '../data/subAdminData.js'

function statusClass(status) {
  if (status === 'Approved') return 'student-status-good'
  if (status === 'Rejected') return 'student-status-bad'
  return 'student-status-pending'
}

function TrainerAttendanceRequests() {
  const [requests, setRequests] = useState(initialRequests)

  const setStatus = (id, status) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <div className="subadmin-page">
      <SubAdminTopbar breadcrumb={['Home', 'Trainers', 'Attendance', 'Requests']} />

      <h4 className="course-tab-heading" style={{ marginBottom: 14 }}>
        <FontAwesomeIcon icon={faClipboardCheck} /> Attendance Correction Requests
      </h4>

      <div className="course-tab-box">
        {requests.map((r) => (
          <div key={r.id} className="trainer-request-row">
            <div className="trainer-request-info">
              <p className="trainer-request-name">{r.trainer} <span className="trainer-request-date">— {r.date}</span></p>
              <p className="trainer-request-reason">{r.reason}</p>
            </div>
            <span className={`student-status-chip ${statusClass(r.status)}`}>{r.status}</span>
            {r.status === 'Pending' && (
              <div className="trainer-request-actions">
                <button type="button" className="trainer-request-approve-btn" onClick={() => setStatus(r.id, 'Approved')}>
                  <FontAwesomeIcon icon={faCheck} /> Approve
                </button>
                <button type="button" className="trainer-request-reject-btn" onClick={() => setStatus(r.id, 'Rejected')}>
                  <FontAwesomeIcon icon={faXmark} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrainerAttendanceRequests
