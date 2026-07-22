import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import SubAdminTopbar from '../Layout/SubAdminTopbar.jsx'
import { findStudentByRoll } from '../data/subAdminData.js'

function AttendanceMulti() {
  const [date, setDate] = useState('2026-06-20')
  const [rollText, setRollText] = useState('')
  const [result, setResult] = useState(null)

  const handleUpdate = (e) => {
    e.preventDefault()
    const rolls = rollText.split(',').map((r) => r.trim()).filter(Boolean)
    let marked = 0
    let notFound = 0
    rolls.forEach((r) => {
      if (findStudentByRoll(r)) marked++
      else notFound++
    })
    setResult({ total: rolls.length, marked, notFound })
  }

  return (
    <div className="subadmin-page">
      <SubAdminTopbar breadcrumb={['Home', 'Attendance', 'Multi Attendance']} />

      <form className="updation-form-box" onSubmit={handleUpdate}>
        <div className="auth-input-group">
          <label className="auth-input-label">
            <FontAwesomeIcon icon={faCalendarDay} /> Date
          </label>
          <div className="auth-input-wrap">
            <input type="date" className="auth-input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Roll Numbers</label>
          <textarea
            className="feedback-textarea updation-textarea"
            rows={6}
            placeholder="Roll numbers example: 822446, 822447, 822448"
            value={rollText}
            onChange={(e) => setRollText(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="auth-btn-primary updation-submit-btn">
          <FontAwesomeIcon icon={faCheckDouble} /> Update
        </button>

        <p className="updation-helper-text">
          Use this link for comma separated values: <a href="https://arraythis.com" target="_blank" rel="noreferrer">arraythis.com</a>
        </p>
      </form>

      {result && (
        <div className="updation-result-box">
          <p><strong>{result.marked}</strong> students marked present for {date}.</p>
          {result.notFound > 0 && <p className="updation-result-warning">{result.notFound} roll number(s) were not found.</p>}
        </div>
      )}
    </div>
  )
}

export default AttendanceMulti
