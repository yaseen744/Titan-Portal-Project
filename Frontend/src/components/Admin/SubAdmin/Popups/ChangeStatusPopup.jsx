import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faTag } from '@fortawesome/free-solid-svg-icons'
import { statusOptions } from '../data/subAdminData.js'

function ChangeStatusPopup({ student, onClose, onSave }) {
  const [status, setStatus] = useState(student?.status || 'pending')

  if (!student) return null

  return (
    <div className="generic-popup-overlay">
      <div className="assignment-submit-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faTag} /> Change Status — {student.name}
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">New Status</label>
          <div className="auth-input-wrap">
            <select className="auth-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>Back</button>
          <button
            className="generic-popup-btn"
            onClick={() => {
              onSave(student.id, status)
              onClose()
            }}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangeStatusPopup
