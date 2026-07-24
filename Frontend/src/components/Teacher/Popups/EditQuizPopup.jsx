import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/axios.js'

function EditQuizPopup({ quiz, onClose, onSaved }) {
  const [name, setName] = useState(quiz?.name || '')
  const [dueDate, setDueDate] = useState(quiz?.dueDate || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!quiz) return null

  const handleSave = async () => {
    setError('')
    setSaving(true)
    try {
      await api.put(`/teacher/quizzes/${quiz.id}`, { name, dueDate })
      if (onSaved) onSaved()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

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
          <label className="auth-input-label">Due Date</label>
          <div className="auth-input-wrap">
            <input type="date" className="auth-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        {error && <p className="auth-error-text">{error}</p>}

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>Back</button>
          <button className="generic-popup-btn" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditQuizPopup
