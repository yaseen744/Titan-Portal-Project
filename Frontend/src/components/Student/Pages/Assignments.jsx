import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileLines, faPaperPlane, faCircleCheck, faCircleXmark,
  faEye, faCloudArrowUp, faPenToSquare, faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import StudentTopbar from '../Layout/StudentTopbar.jsx'
import AssignmentViewPopup from '../Popups/AssignmentViewPopup.jsx'
import AssignmentSubmitPopup from '../Popups/AssignmentSubmitPopup.jsx'
import { formatDate } from '../../Media/dateUtils.js'
import api from '../../../api/axios.js'
import { getStudentInfo } from '../../../api/session.js'

const PAGE_SIZE = 8

function statusClass(status) {
  if (status === 'Approved') return 'assignment-row-approved'
  if (status === 'Not Approved') return 'assignment-row-not-approved'
  return 'assignment-row-not-submitted'
}

// Converts a raw backend assignment (with its submission, if any) into the
// exact shape the UI already expects (same field names as the old dummy data).
function mapAssignment(a, courseName) {
  const sub = a.submission
  let status = 'Not Submitted'
  if (sub) {
    if (sub.status === 'approved') status = 'Approved'
    else if (sub.status === 'disapproved') status = 'Not Approved'
    else status = 'Not Approved' // submitted/late/pending - still editable until graded
  }

  let link = ''
  let notes = ''
  if (sub?.content) {
    try {
      const parsed = JSON.parse(sub.content)
      link = parsed.link || ''
      notes = parsed.notes || ''
    } catch {
      notes = sub.content
    }
  }

  return {
    id: a._id,
    name: a.name,
    course: courseName,
    dueDate: a.dueDate ? formatDate(new Date(a.dueDate)) : '',
    status,
    description: a.description,
    submittedOn: sub?.submittedAt ? formatDate(new Date(sub.submittedAt)) : '',
    submissionLink: link,
    submissionNotes: notes,
    submissionImage: '',
  }
}

function Assignments() {
  const { openFeedback } = useOutletContext()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageItems, setPageItems] = useState([])
  const [summary, setSummary] = useState({ total: 0, submitted: 0, approved: 0, notApproved: 0 })
  const [viewing, setViewing] = useState(null)
  const [submitPopup, setSubmitPopup] = useState(null) // { assignment, mode }

  const courseName = getStudentInfo()?.course || ''

  const loadAssignments = () => {
    api.get('/student/assignments', { params: { page } })
      .then(({ data }) => {
        const mapped = data.assignments.map((a) => mapAssignment(a, courseName))
        setPageItems(mapped)
        setTotalPages(data.totalPages || 1)
        setTotalCount(data.total || 0)
        setSummary({
          total: data.total || 0,
          submitted: mapped.filter((m) => m.status !== 'Not Submitted').length,
          approved: mapped.filter((m) => m.status === 'Approved').length,
          notApproved: mapped.filter((m) => m.status === 'Not Approved').length,
        })
      })
      .catch((err) => console.error('Could not load assignments', err))
  }

  useEffect(() => {
    loadAssignments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const start = (page - 1) * PAGE_SIZE

  return (
    <div className="student-page">
      <StudentTopbar breadcrumb={['Home', 'WMA', 'Dashboard', 'Assignments']} onFeedbackClick={openFeedback} />

      <div className="assignment-stat-row">
        <div className="assignment-stat-box">
          <FontAwesomeIcon icon={faFileLines} className="assignment-stat-icon" />
          <span className="assignment-stat-value">{summary.total}</span>
          <span className="assignment-stat-label">Total</span>
        </div>
        <div className="assignment-stat-box">
          <FontAwesomeIcon icon={faPaperPlane} className="assignment-stat-icon" />
          <span className="assignment-stat-value">{summary.submitted}</span>
          <span className="assignment-stat-label">Submitted</span>
        </div>
        <div className="assignment-stat-box">
          <FontAwesomeIcon icon={faCircleCheck} className="assignment-stat-icon" />
          <span className="assignment-stat-value">{summary.approved}</span>
          <span className="assignment-stat-label">Approved</span>
        </div>
        <div className="assignment-stat-box">
          <FontAwesomeIcon icon={faCircleXmark} className="assignment-stat-icon" />
          <span className="assignment-stat-value">{summary.notApproved}</span>
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
            Showing {totalCount === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, totalCount)} of {totalCount} records
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
          onDone={() => {
            setSubmitPopup(null)
            loadAssignments()
          }}
        />
      )}
    </div>
  )
}

export default Assignments
