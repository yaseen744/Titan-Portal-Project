import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import {
  getAssignmentsForCourse, studentAssignmentStatus, getQuizzesForCourse, studentQuizResult,
} from '../data/teacherData.js'

const tabs = ['Attendance', 'Assignments', 'Quizzes']

function StudentDetailPopup({ student, course, onClose }) {
  const [tab, setTab] = useState('Attendance')
  if (!student) return null

  const assignments = getAssignmentsForCourse(course)
  const quizzes = getQuizzesForCourse(course)

  return (
    <div className="generic-popup-overlay">
      <div className="student-detail-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faUserGraduate} /> {student.name}
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <p className="student-detail-meta">Roll: {student.roll} &nbsp;|&nbsp; {student.email}</p>

        <div className="course-detail-tab-row student-detail-tab-row">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              className={`course-detail-tab-btn ${tab === t ? 'course-detail-tab-btn-active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Attendance' && (
          <div className="student-detail-section">
            <div className="attendance-overview-track">
              <div
                className={`attendance-overview-fill ${student.attendancePercent >= 70 ? 'attendance-overview-fill-good' : 'attendance-overview-fill-bad'}`}
                style={{ width: `${student.attendancePercent}%` }}
              ></div>
            </div>
            <p className="student-detail-percent-label">{student.attendancePercent}% Present</p>
          </div>
        )}

        {tab === 'Assignments' && (
          <div className="student-detail-section">
            {assignments.map((a, idx) => {
              const status = studentAssignmentStatus(student.index, idx)
              return (
                <div key={a.id} className="student-detail-row">
                  <span>{a.name}</span>
                  <span className={`assignment-status-chip assignment-status-${status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {status}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'Quizzes' && (
          <div className="student-detail-section">
            {quizzes.map((q) => {
              const result = studentQuizResult(student.index, q)
              return (
                <div key={q.id} className="student-detail-row">
                  <span>{q.name}</span>
                  <span className={`quiz-status-chip ${result.statusLabel === 'Pass' ? 'quiz-status-passed' : 'quiz-status-failed'}`}>
                    {result.score} ({result.percentage}%)
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <div className="assignment-view-footer">
          <button type="button" className="generic-popup-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailPopup
