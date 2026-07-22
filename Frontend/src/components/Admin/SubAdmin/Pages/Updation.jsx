import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import SubAdminTopbar from '../Layout/SubAdminTopbar.jsx'
import { statusOptions, findStudentByRoll } from '../data/subAdminData.js'

function Updation() {
  const [updateType, setUpdateType] = useState('results')
  const [rollText, setRollText] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [result, setResult] = useState(null)

  const handleUpdate = (e) => {
    e.preventDefault()
    const rolls = rollText.split(',').map((r) => r.trim()).filter(Boolean)
    let updated = 0
    let notFound = 0
    rolls.forEach((r) => {
      if (findStudentByRoll(r)) updated++
      else notFound++
    })
    setResult({ updated, notFound })
  }

  return (
    <div className="subadmin-page">
      <SubAdminTopbar breadcrumb={['Home', 'Updation']} />

      <form className="updation-form-box" onSubmit={handleUpdate}>
        <div className="auth-input-group">
          <label className="auth-input-label">Update Type</label>
          <div className="auth-input-wrap">
            <select className="auth-input" value={updateType} onChange={(e) => setUpdateType(e.target.value)}>
              <option value="results">results</option>
            </select>
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Roll Numbers</label>
          <textarea
            className="feedback-textarea updation-textarea"
            rows={6}
            placeholder="Roll numbers example: 1122,1123,1124,1125"
            value={rollText}
            onChange={(e) => setRollText(e.target.value)}
          ></textarea>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Message (optional)</label>
          <div className="auth-input-wrap">
            <input
              className="auth-input"
              placeholder="Add an optional message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Select Status</label>
          <div className="auth-input-wrap">
            <select className="auth-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select status</option>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" className="auth-btn-primary updation-submit-btn" disabled={!status || !rollText.trim()}>
          <FontAwesomeIcon icon={faArrowsRotate} /> Update
        </button>

        <p className="updation-helper-text">
          Use this link for comma separated values: <a href="https://arraythis.com" target="_blank" rel="noreferrer">Text to Array Converter</a>
        </p>
      </form>

      {result && (
        <div className="updation-result-box">
          <p><strong>{result.updated}</strong> student(s) updated to status "{status}".</p>
          {result.notFound > 0 && <p className="updation-result-warning">{result.notFound} roll number(s) were not found.</p>}
        </div>
      )}
    </div>
  )
}

export default Updation
