import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faFileCircleQuestion, faCircleCheck, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/axios.js'

const emptyQuestion = () => ({ text: '', options: ['', '', '', ''], correctOptions: [] })

function NewQuizPopup({ show, onClose, course, onCreated }) {
  const [name, setName] = useState('')
  const [totalMarks, setTotalMarks] = useState('')
  const [timerMinutes, setTimerMinutes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [created, setCreated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!show) return null

  const canCreate =
    name.trim() &&
    dueDate.trim() &&
    questions.length > 0 &&
    questions.every((q) => q.text.trim() && q.options.every((o) => o.trim()) && q.correctOptions.length > 0)

  const handleClose = () => {
    setName('')
    setTotalMarks('')
    setTimerMinutes('')
    setDueDate('')
    setDueTime('')
    setQuestions([emptyQuestion()])
    setCreated(false)
    setError('')
    onClose()
  }

  const updateQuestionText = (idx, text) => {
    const updated = [...questions]
    updated[idx].text = text
    setQuestions(updated)
  }

  const updateOption = (qIdx, oIdx, value) => {
    const updated = [...questions]
    updated[qIdx].options[oIdx] = value
    setQuestions(updated)
  }

  const toggleCorrect = (qIdx, oIdx) => {
    const updated = [...questions]
    const current = updated[qIdx].correctOptions
    updated[qIdx].correctOptions = current.includes(oIdx)
      ? current.filter((i) => i !== oIdx)
      : [...current, oIdx]
    setQuestions(updated)
  }

  const addQuestion = () => setQuestions([...questions, emptyQuestion()])
  const removeQuestion = (idx) => setQuestions(questions.filter((_, i) => i !== idx))

  const handleCreate = async () => {
    setError('')
    setSaving(true)
    try {
      await api.post('/teacher/quizzes', {
        batchId: course.batchId,
        name,
        totalMarks: Number(totalMarks) || questions.length,
        timerSeconds: (Number(timerMinutes) || 10) * 60,
        dueDate,
        dueTime,
        questions,
      })
      setCreated(true)
      if (onCreated) onCreated()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create quiz. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (created) {
    return (
      <div className="generic-popup-overlay">
        <div className="generic-popup-card">
          <div className="generic-popup-icon-wrap">
            <FontAwesomeIcon icon={faCircleCheck} className="generic-popup-icon" />
          </div>
          <h3 className="generic-popup-title">Quiz Created!</h3>
          <p className="generic-popup-text">
            Your quiz has been created and is now visible to your students.
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
      <div className="assignment-submit-card quiz-builder-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faFileCircleQuestion} /> Create Quiz
          </span>
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Quiz Name</label>
          <div className="auth-input-wrap">
            <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HTML & CSS Basics Quiz" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="auth-input-group">
            <label className="auth-input-label">Total Marks</label>
            <div className="auth-input-wrap">
              <input type="number" className="auth-input" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="e.g. 10" />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Timer (minutes)</label>
            <div className="auth-input-wrap">
              <input type="number" className="auth-input" value={timerMinutes} onChange={(e) => setTimerMinutes(e.target.value)} placeholder="e.g. 15" />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="auth-input-group">
            <label className="auth-input-label">Due Date</label>
            <div className="auth-input-wrap">
              <input type="date" className="auth-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Due Time</label>
            <div className="auth-input-wrap">
              <input type="time" className="auth-input" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Questions</label>
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="detail-card" style={{ marginBottom: 12, padding: 14, border: '1px solid var(--border, #e3e8ef)', borderRadius: 10 }}>
              <div className="auth-input-wrap" style={{ marginBottom: 8 }}>
                <input
                  className="auth-input"
                  placeholder={`Question ${qIdx + 1}`}
                  value={q.text}
                  onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                />
              </div>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <input
                    type="checkbox"
                    checked={q.correctOptions.includes(oIdx)}
                    onChange={() => toggleCorrect(qIdx, oIdx)}
                    title="Mark as correct"
                  />
                  <input
                    className="auth-input"
                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                    value={opt}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                  />
                </div>
              ))}
              {questions.length > 1 && (
                <button type="button" className="generic-popup-btn-danger" onClick={() => removeQuestion(qIdx)} style={{ marginTop: 6 }}>
                  <FontAwesomeIcon icon={faTrashCan} /> Remove Question
                </button>
              )}
            </div>
          ))}
          <button type="button" className="course-tab-new-btn" onClick={addQuestion}>
            <FontAwesomeIcon icon={faPlus} /> Add Question
          </button>
        </div>

        {error && <p className="auth-error-text">{error}</p>}

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={handleClose}>Back</button>
          <button className="generic-popup-btn" disabled={!canCreate || saving} onClick={handleCreate}>
            {saving ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewQuizPopup
