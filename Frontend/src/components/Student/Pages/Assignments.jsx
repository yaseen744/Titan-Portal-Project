import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileLines, faPaperPlane, faCircleCheck, faCircleXmark,
  faEye, faCloudArrowUp, faPenToSquare, faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import StudentTopbar from '../Layout/StudentTopbar.jsx'
import AssignmentViewPopup from '../Popups/AssignmentViewPopup.jsx'
import AssignmentSubmitPopup from '../Popups/AssignmentSubmitPopup.jsx'
import { assignments, assignmentSummary } from '../data/studentData.js'

const PAGE_SIZE = 8

function statusClass(status) {
  if (status === 'Approved') return 'assignment-row-approved'
  if (status === 'Not Approved') return 'assignment-row-not-approved'
  return 'assignment-row-not-submitted'
}

function Assignments() {
  const { openFeedback } = useOutletContext()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState(null)
  const [submitPopup, setSubmitPopup] = useState(null) // { assignment, mode }

  const totalPages = Math.ceil(assignments.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageItems = assignments.slice(start, start + PAGE_SIZE)

  return (
    <div className="student-page">
      <StudentTopbar breadcrumb={['Home', 'WMA', 'Dashboard', 'Assignments']} onFeedbackClick={openFeedback} />

      <div className="assignment-stat-row">
        <div className="assignment-stat-box">
          <FontAwesomeIcon icon={faFileLines} className="assignment-stat-icon" />
          <span className="assignment-stat-value">{assignmentSummary.total}</span>
          <span className="assignment-stat-label">Total</span>
        </div>
        <div className="assignment-stat-box">
          <FontAwesomeIcon icon={faPaperPlane} className="assignment-stat-icon" />
          <span className="assignment-stat-value">{assignmentSummary.submitted}</span>
          <span className="assignment-stat-label">Submitted</span>
        </div>
        <div className="assignment-stat-box">
          <FontAwesomeIcon icon={faCircleCheck} className="assignment-stat-icon" />
          <span className="assignment-stat-value">{assignmentSummary.approved}</span>
          <span className="assignment-stat-label">Approved</span>
        </div>
        <div className="assignment-stat-box">
          <FontAwesomeIcon icon={faCircleXmark} className="assignment-stat-icon" />
          <span className="assignment-stat-value">{assignmentSummary.notApproved}</span>
          <span className="assignment-stat-label">Not Approved</span>
        </div>
      </div>

      <div className="assignment-list-box">
        <div className="assignment-list-head">
          <span>Assignment</span>
          <span>Course</span>
          <span>Due Date</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {pageItems.map((a) => {
          const notSubmitted = a.status === 'Not Submitted'
          const editable = a.status === 'Not Approved'
          return (
            <div key={a.id} className={`assignment-list-row ${statusClass(a.status)}`}>
              <span className="assignment-row-name">{a.name}</span>
              <span className="assignment-row-course">{a.course}</span>
              <span className="assignment-row-date">{a.dueDate}</span>
              <span className={`assignment-status-chip assignment-status-${a.status.replace(/\s+/g, '-').toLowerCase()}`}>
                {a.status}
              </span>
              <span className="assignment-row-actions">
                <FontAwesomeIcon
                  icon={faEye}
                  className={`assignment-action-icon ${notSubmitted ? 'assignment-action-icon-disabled' : ''}`}
                  onClick={() => !notSubmitted && setViewing(a)}
                  title="View"
                />
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className={`assignment-action-icon ${!notSubmitted ? 'assignment-action-icon-disabled' : ''}`}
                  onClick={() => notSubmitted && setSubmitPopup({ assignment: a, mode: 'submit' })}
                  title="Submit"
                />
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className={`assignment-action-icon ${!editable ? 'assignment-action-icon-disabled' : ''}`}
                  onClick={() => editable && setSubmitPopup({ assignment: a, mode: 'edit' })}
                  title="Edit"
                />
              </span>
            </div>
          )
        })}

        <div className="assignment-pagination-row">
          <span className="assignment-pagination-text">
            Showing {start + 1}-{Math.min(start + PAGE_SIZE, assignments.length)} of {assignments.length} records
          </span>
          <div className="assignment-pagination-btns">
            <button
              type="button"
              className="assignment-page-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Previous
            </button>
            <button
              type="button"
              className="assignment-page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {viewing && <AssignmentViewPopup assignment={viewing} onClose={() => setViewing(null)} />}

      {submitPopup && (
        <AssignmentSubmitPopup
          assignment={submitPopup.assignment}
          mode={submitPopup.mode}
          onClose={() => setSubmitPopup(null)}
          onDone={() => setSubmitPopup(null)}
        />
      )}
    </div>
  )
}

export default Assignments
