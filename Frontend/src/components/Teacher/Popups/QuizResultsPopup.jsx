import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faFileCircleQuestion, faTrashCan, faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { getStudentsForCourse, studentQuizResult } from '../data/teacherData.js'

const PAGE_SIZE = 8

function QuizResultsPopup({ quiz, course, onClose }) {
  const allStudents = useMemo(() => getStudentsForCourse(course), [course])
  const [removedIds, setRemovedIds] = useState([])
  const [confirmingId, setConfirmingId] = useState(null)
  const [page, setPage] = useState(1)

  if (!quiz) return null

  const results = allStudents
    .filter((s) => !removedIds.includes(s.id))
    .map((s) => ({ ...s, result: studentQuizResult(s.index, quiz) }))

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const pageItems = results.slice(start, start + PAGE_SIZE)

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
            <span>Email</span>
            <span>Status</span>
            <span>Score</span>
            <span>Attempts</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          {pageItems.map((s) => (
            <div key={s.id} className="quiz-results-row">
              <span>{s.name}</span>
              <span className="student-row-email">{s.email}</span>
              <span className={`quiz-status-chip ${s.result.statusLabel === 'Pass' ? 'quiz-status-passed' : 'quiz-status-failed'}`}>
                {s.result.statusLabel}
              </span>
              <span>{s.result.score}</span>
              <span>{s.result.attempts}</span>
              <span className="quiz-results-date">{s.result.date}</span>
              <span>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="assignment-action-icon"
                  onClick={() => setConfirmingId(s.id)}
                  title="Delete"
                />
              </span>
            </div>
          ))}
        </div>

        <div className="assignment-pagination-row">
          <span className="assignment-pagination-text">
            Showing {start + 1}-{Math.min(start + PAGE_SIZE, results.length)} of {results.length} records
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
            <h3 className="generic-popup-title">Delete this result?</h3>
            <p className="generic-popup-text">
              This will remove the student's quiz attempt so they can retake it. This action
              can't be undone.
            </p>
            <div className="feedback-confirm-btn-row">
              <button className="generic-popup-btn-outline" onClick={() => setConfirmingId(null)}>Back</button>
              <button
                className="generic-popup-btn"
                onClick={() => {
                  setRemovedIds([...removedIds, confirmingId])
                  setConfirmingId(null)
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizResultsPopup
