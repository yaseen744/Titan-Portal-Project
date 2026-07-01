import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faFileCirclePlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

function NewAssignmentPopup({ show, onClose }) {
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [created, setCreated] = useState(false)

  if (!show) return null

  const canCreate = name.trim() && dueDate.trim() && description.trim()

  const handleClose = () => {
    setName('')
    setDueDate('')
    setDescription('')
    setCreated(false)
    onClose()
  }

  if (created) {
    return (
      <div className="generic-popup-overlay">
        <div className="generic-popup-card">
          <div className="generic-popup-icon-wrap">
            <FontAwesomeIcon icon={faCircleCheck} className="generic-popup-icon" />
          </div>
          <h3 className="generic-popup-title">Created!</h3>
          <p className="generic-popup-text">
            Your assignment has been created. (This is a frontend demo - it won't actually be
            saved until the database is connected.)
          </p>
          <div className="feedback-confirm-btn-row">
            <button className="generic-popup-btn-outline" onClick={handleClose}>Back</button>
            <button className="generic-popup-btn" onClick={handleClose}>Done</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="generic-popup-overlay">
      <div className="assignment-submit-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faFileCirclePlus} /> New Assignment
          </span>
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Assignment Name</label>
          <div className="auth-input-wrap">
            <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CSS Grid Test" />
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Due Date</label>
          <div className="auth-input-wrap">
            <input type="date" className="auth-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Description</label>
          <textarea
            className="feedback-textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what students need to submit"
          ></textarea>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={handleClose}>Back</button>
          <button className="generic-popup-btn" disabled={!canCreate} onClick={() => setCreated(true)}>Create</button>
        </div>
      </div>
    </div>
  )
}

export default NewAssignmentPopup
