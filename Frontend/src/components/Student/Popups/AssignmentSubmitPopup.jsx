import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUpload, faPaperclip, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

// mode: 'submit' or 'edit'
function AssignmentSubmitPopup({ assignment, mode = 'submit', onClose, onDone }) {
  const [link, setLink] = useState(mode === 'edit' ? assignment?.submissionLink || '' : '')
  const [fileName, setFileName] = useState('')
  const [description, setDescription] = useState(mode === 'edit' ? assignment?.submissionNotes || '' : '')
  const [done, setDone] = useState(false)

  if (!assignment) return null

  const canSubmit = link.trim().length > 0 && description.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    setDone(true)
  }

  if (done) {
    return (
      <div className="generic-popup-overlay">
        <div className="waiting-popup-card">
          <FontAwesomeIcon icon={faCircleCheck} className="assignment-done-icon" />
          <p className="waiting-popup-label">{mode === 'edit' ? 'Updated!' : 'Submitted!'}</p>
          <div className="waiting-popup-track">
            <div
              className="waiting-popup-fill"
              style={{ animationDuration: '1000ms' }}
              onAnimationEnd={() => onDone && onDone()}
            ></div>
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
            <FontAwesomeIcon icon={faPaperclip} /> {mode === 'edit' ? 'Edit Assignment' : 'Submit Assignment'}
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">GitHub / Project Link</label>
          <div className="auth-input-wrap">
            <input
              type="text"
              className="auth-input"
              placeholder="https://github.com/your-repo"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Attachment</label>
          <label className="feedback-add-image-btn assignment-attach-btn">
            <FontAwesomeIcon icon={faUpload} /> {fileName || 'Choose Image'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
            />
          </label>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Description</label>
          <textarea
            className="feedback-textarea"
            rows={3}
            placeholder="Write a short description of your submission"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>
            Back
          </button>
          <button className="generic-popup-btn" disabled={!canSubmit} onClick={handleSubmit}>
            {mode === 'edit' ? 'Save' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignmentSubmitPopup
