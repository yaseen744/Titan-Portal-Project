import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/axios.js'

const tabs = ['Attendance', 'Assignments', 'Quizzes']

function StudentDetailPopup({ student, course, onClose }) {
  const [tab, setTab] = useState('Attendance')
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (!student) return
    api.get(`/teacher/students/${student.id}`)
      .then(({ data }) => setDetail(data))
      .catch((err) => console.error('Could not load student detail', err))
  }, [student])

  if (!student) return null

  const attendancePercent = detail?.attendancePercent || 0
  const assignments = detail?.assignmentStatus || []
  const quizzes = detail?.quizStatus || []

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
                className={`attendance-overview-fill ${attendancePercent >= 70 ? 'attendance-overview-fill-good' : 'attendance-overview-fill-bad'}`}
                style={{ width: `${attendancePercent}%` }}
              ></div>
            </div>
            <p className="student-detail-percent-label">{attendancePercent}% Present</p>
          </div>
        )}

        {tab === 'Assignments' && (
          <div className="student-detail-section">
            {assignments.map((a) => {
              const label = a.status === 'not submitted' ? 'Not Submitted'
                : a.status === 'approved' ? 'Approved'
                : a.status === 'disapproved' ? 'Not Approved'
                : a.status === 'late' ? 'Late'
                : 'Submitted'
              return (
                <div key={a.assignmentId} className="student-detail-row">
                  <span>{a.name}</span>
                  <span className={`assignment-status-chip assignment-status-${label.replace(/\s+/g, '-').toLowerCase()}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'Quizzes' && (
          <div className="student-detail-section">
            {quizzes.map((q) => (
              <div key={q.quizId} className="student-detail-row">
                <span>{q.name}</span>
                <span className={`quiz-status-chip ${q.passed ? 'quiz-status-passed' : 'quiz-status-failed'}`}>
                  {q.percentage}%
                </span>
              </div>
            ))}
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
