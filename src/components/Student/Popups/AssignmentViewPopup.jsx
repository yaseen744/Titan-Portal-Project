import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faFileLines, faPaperclip } from '@fortawesome/free-solid-svg-icons'

function AssignmentViewPopup({ assignment, onClose }) {
  const [enlarged, setEnlarged] = useState(false)

  if (!assignment) return null

  return (
    <div className="generic-popup-overlay">
      <div className="assignment-view-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faFileLines} /> Assignment Information
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="assignment-view-section">
          <h4 className="assignment-view-title">{assignment.name}</h4>
          <div className="assignment-view-meta-row">
            <span>Due: {assignment.dueDate}, 11:59 PM</span>
            <span className={`assignment-grade-chip assignment-grade-${assignment.status.replace(/\s+/g, '-').toLowerCase()}`}>
              {assignment.status}
            </span>
          </div>
          <p className="assignment-view-description">{assignment.description}</p>
        </div>

        {assignment.status !== 'Not Submitted' && (
          <div className="assignment-view-section">
            <h5 className="assignment-view-subheading">
              <FontAwesomeIcon icon={faPaperclip} /> Submission Details
            </h5>
            <p className="assignment-view-label">Submitted on</p>
            <p className="assignment-view-value">{assignment.submittedOn}, 11:42 AM</p>

            <p className="assignment-view-label">Submission Link</p>
            <div className="assignment-view-link-box">{assignment.submissionLink}</div>

            {assignment.submissionImage && (
              <img
                src={assignment.submissionImage}
                alt="Submission attachment"
                className="assignment-view-image"
                onClick={() => setEnlarged(true)}
              />
            )}

            <p className="assignment-view-label">Submission Notes</p>
            <div className="assignment-view-notes-box">{assignment.submissionNotes}</div>
          </div>
        )}

        <div className="assignment-view-footer">
          <button type="button" className="generic-popup-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {enlarged && (
        <div className="image-enlarge-overlay" onClick={() => setEnlarged(false)}>
          <img src={assignment.submissionImage} alt="Submission enlarged" className="image-enlarge-img" />
        </div>
      )}
    </div>
  )
}

export default AssignmentViewPopup
