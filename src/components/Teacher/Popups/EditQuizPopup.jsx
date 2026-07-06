import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

function EditQuizPopup({ quiz, onClose }) {
  const [name, setName] = useState(quiz?.name || '')
  const [questions, setQuestions] = useState(quiz?.questions || 0)
  const [dueDate, setDueDate] = useState(quiz?.dueDate || '')

  if (!quiz) return null

  return (
    <div className="generic-popup-overlay">
      <div className="assignment-submit-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faPenToSquare} /> Edit Quiz
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Quiz Name</label>
          <div className="auth-input-wrap">
            <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Number of Questions</label>
          <div className="auth-input-wrap">
            <input
              type="number"
              className="auth-input"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Due Date</label>
          <div className="auth-input-wrap">
            <input className="auth-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>Back</button>
          <button className="generic-popup-btn" onClick={onClose}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default EditQuizPopup
