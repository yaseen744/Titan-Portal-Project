import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { getQuizzesForCourse } from '../data/teacherData.js'
import QuizResultsPopup from '../Popups/QuizResultsPopup.jsx'
import EditQuizPopup from '../Popups/EditQuizPopup.jsx'

function CourseQuizzesTab({ course }) {
  const quizzes = useMemo(() => getQuizzesForCourse(course), [course])
  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)

  return (
    <div className="course-tab-box">
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
      {editing && <EditQuizPopup quiz={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}

export default CourseQuizzesTab
