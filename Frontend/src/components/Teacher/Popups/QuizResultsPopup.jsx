import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faFileCircleQuestion, faTrashCan, faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/axios.js'

const PAGE_SIZE = 8

function QuizResultsPopup({ quiz, course, onClose }) {
  const [results, setResults] = useState([])
  const [confirmingId, setConfirmingId] = useState(null)
  const [page, setPage] = useState(1)

  const load = () => {
    api.get(`/teacher/quizzes/${quiz.id}/attempts`)
      .then(({ data }) => {
        setResults(
          (data.students || []).map((s) => {
            const best = s.attempts.reduce((b, a) => (!b || a.percentage > b.percentage ? a : b), null)
            const last = s.attempts[s.attempts.length - 1]
            return {
              id: s.studentId,
              name: s.name,
              rollNumber: s.rollNumber,
              statusLabel: best?.passed ? 'Pass' : s.attempts.length ? 'Fail' : 'Not Attempted',
              score: best ? `${best.correctCount}/${best.totalQuestions}` : '-',
              attempts: s.attempts.length,
              date: last?.submittedAt ? new Date(last.submittedAt).toLocaleDateString() : '-',
            }
          })
        )
      })
      .catch((err) => console.error('Could not load quiz results', err))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz])

  if (!quiz) return null

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const pageItems = results.slice(start, start + PAGE_SIZE)

  const handleConfirmReset = async () => {
    try {
      await api.delete(`/teacher/quizzes/${quiz.id}/attempts/${confirmingId}`)
      setConfirmingId(null)
      load()
    } catch (err) {
      console.error('Could not reset attempts', err)
    }
  }

  return (
    <div className="generic-popup-overlay">
      <div className="submissions-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faFileCircleQuestion} /> Quiz Results — {quiz.name}
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="quiz-results-table">
          <div className="quiz-results-head">
            <span>Name</span>
            <span>Roll No</span>
            <span>Status</span>
            <span>Score</span>
            <span>Attempts</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          {pageItems.map((s) => (
            <div key={s.id} className="quiz-results-row">
              <span>{s.name}</span>
              <span className="student-row-email">{s.rollNumber}</span>
              <span className={`quiz-status-chip ${s.statusLabel === 'Pass' ? 'quiz-status-passed' : 'quiz-status-failed'}`}>
                {s.statusLabel}
              </span>
              <span>{s.score}</span>
              <span>{s.attempts}</span>
              <span className="quiz-results-date">{s.date}</span>
              <span>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="assignment-action-icon"
                  onClick={() => setConfirmingId(s.id)}
                  title="Reset Attempts"
                />
              </span>
            </div>
          ))}
        </div>

        <div className="assignment-pagination-row">
          <span className="assignment-pagination-text">
            Showing {results.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, results.length)} of {results.length} records
          </span>
          <div className="assignment-pagination-btns">
            <button type="button" className="assignment-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <FontAwesomeIcon icon={faChevronLeft} /> Previous
            </button>
            <button type="button" className="assignment-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {confirmingId && (
        <div className="generic-popup-overlay">
          <div className="generic-popup-card">
            <h3 className="generic-popup-title">Reset this student's attempts?</h3>
            <p className="generic-popup-text">
              This will remove the student's quiz attempts so they can retake it. This action
              can't be undone.
            </p>
            <div className="feedback-confirm-btn-row">
              <button className="generic-popup-btn-outline" onClick={() => setConfirmingId(null)}>Back</button>
              <button className="generic-popup-btn" onClick={handleConfirmReset}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizResultsPopup
