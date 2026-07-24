import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons'
import QuizResultsPopup from '../Popups/QuizResultsPopup.jsx'
import EditQuizPopup from '../Popups/EditQuizPopup.jsx'
import NewQuizPopup from '../Popups/NewQuizPopup.jsx'
import api from '../../../api/axios.js'

function CourseQuizzesTab({ course }) {
  const [quizzes, setQuizzes] = useState([])
  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showNew, setShowNew] = useState(false)

  const loadQuizzes = () => {
    api.get('/teacher/quizzes', { params: { batchId: course.batchId } })
      .then(({ data }) => {
        setQuizzes(
          (data.quizzes || []).map((q) => ({
            id: q._id,
            name: q.name,
            dueDate: q.dueDate ? new Date(q.dueDate).toLocaleDateString() : '',
            status: 'Active',
          }))
        )
      })
      .catch((err) => console.error('Could not load quizzes', err))
  }

  useEffect(() => {
    loadQuizzes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.batchId])

  return (
    <div className="course-tab-box">
      <div className="course-tab-header-row">
        <h4 className="course-tab-heading">Quizzes</h4>
        <button type="button" className="course-tab-new-btn" onClick={() => setShowNew(true)}>
          <FontAwesomeIcon icon={faPlus} /> Create Quiz
        </button>
      </div>

      <div className="teacher-assignment-list-head teacher-quiz-list-head">
        <span>Quiz</span>
        <span>Course</span>
        <span>Date</span>
        <span>Expiry</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      {quizzes.map((q) => (
        <div key={q.id} className="teacher-assignment-list-row teacher-quiz-list-row">
          <span className="assignment-row-name">{q.name}</span>
          <span className="assignment-row-course">{course.title}</span>
          <span>{q.dueDate}</span>
          <span>{q.dueDate}</span>
          <span className="quiz-active-chip">{q.status}</span>
          <span className="teacher-quiz-action-row">
            <FontAwesomeIcon icon={faEye} className="assignment-action-icon" onClick={() => setViewing(q)} title="View Results" />
            <FontAwesomeIcon icon={faPenToSquare} className="assignment-action-icon" onClick={() => setEditing(q)} title="Edit" />
          </span>
        </div>
      ))}

      {viewing && <QuizResultsPopup quiz={viewing} course={course} onClose={() => setViewing(null)} />}
      {editing && <EditQuizPopup quiz={editing} onClose={() => setEditing(null)} onSaved={loadQuizzes} />}
      <NewQuizPopup show={showNew} onClose={() => setShowNew(false)} course={course} onCreated={loadQuizzes} />
    </div>
  )
}

export default CourseQuizzesTab
