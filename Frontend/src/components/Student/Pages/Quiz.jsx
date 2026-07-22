import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faEllipsis, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import StudentTopbar from '../Layout/StudentTopbar.jsx'
import api from '../../../api/axios.js'

const infoLines = [
  'Once started, quizzes must be completed in one session.',
  'Switching tabs or leaving the window will be recorded.',
  'Ensure you have a stable internet connection.',
  'The quiz will open in fullscreen mode.',
]

// Converts a raw backend quiz (with its attempts) into the shape the UI
// already expects (same field names as the old dummy data).
function mapQuiz(q) {
  const bestAttempt = (q.attempts || []).reduce((best, a) => {
    if (!best || a.percentage > best.percentage) return a
    return best
  }, null)

  return {
    id: q._id,
    module: q.course?.name || '',
    title: q.name,
    questions: q.questions?.length || 0,
    attempts: q.attemptsUsed || 0,
    score: bestAttempt ? bestAttempt.correctCount : 0,
    percentage: bestAttempt ? bestAttempt.percentage : 0,
    statusLabel: bestAttempt?.passed ? 'Passed' : q.attemptsUsed > 0 ? 'Failed' : 'Not Attempted',
  }
}

function Quiz() {
  const { openFeedback } = useOutletContext()
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    api.get('/student/quizzes')
      .then(({ data }) => setQuizzes((data.quizzes || []).map(mapQuiz)))
      .catch((err) => console.error('Could not load quizzes', err))
  }, [])

  return (
    <div className="student-page">
      <StudentTopbar breadcrumb={['Home', 'WMA', 'Quiz']} onFeedbackClick={openFeedback} />

      <div className="quiz-info-box">
        <h4 className="quiz-info-heading">
          <FontAwesomeIcon icon={faCircleInfo} /> Important Information
        </h4>
        <ol className="quiz-info-list">
          {infoLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </div>

      <div className="quiz-table-box">
        <div className="quiz-table-head">
          <span>Module</span>
          <span>Title</span>
          <span>Questions</span>
          <span>Attempts</span>
          <span>Score</span>
          <span>Percentage</span>
          <span>Status</span>
          <span>Info</span>
          <span>Action</span>
        </div>

        {quizzes.map((q) => (
          <div key={q.id} className="quiz-table-row">
            <span>{q.module}</span>
            <span>{q.title}</span>
            <span>{q.questions}</span>
            <span>{q.attempts}</span>
            <span>{q.score}</span>
            <span>{q.percentage}%</span>
            <span className={`quiz-status-chip ${q.statusLabel === 'Passed' ? 'quiz-status-passed' : 'quiz-status-failed'}`}>
              {q.statusLabel}
            </span>
            <span className="quiz-info-dots" title="More info">
              <FontAwesomeIcon icon={faEllipsis} />
            </span>
            <span className="quiz-action-completed">
              <FontAwesomeIcon icon={faCircleCheck} /> Completed
            </span>
          </div>
        ))}
      </div>

      <p className="quiz-footer-note">
        Contact your instructor if you have any issues accessing your quizzes.
      </p>
    </div>
  )
}

export default Quiz
