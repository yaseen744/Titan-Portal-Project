import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faFileLines, faMagnifyingGlass, faCircleCheck, faCircleXmark, faClock,
} from '@fortawesome/free-solid-svg-icons'
import { getStudentsForCourse, studentAssignmentStatus } from '../data/teacherData.js'

function ViewSubmissionsPopup({ assignment, assignmentIndex, course, onClose }) {
  const students = useMemo(() => getStudentsForCourse(course), [course])
  const submissions = useMemo(
    () => students.map((s) => ({ ...s, subStatus: studentAssignmentStatus(s.index, assignmentIndex) })),
    [students, assignmentIndex]
  )
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(submissions[0]?.id)
  const [approvedOverrides, setApprovedOverrides] = useState({})

  if (!assignment) return null

  const filtered = submissions.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  const selected = submissions.find((s) => s.id === selectedId) || submissions[0]
  const selectedStatus = approvedOverrides[selected?.id] || selected?.subStatus

  const submittedCount = submissions.filter((s) => s.subStatus !== 'Not Submitted').length
  const approvedCount = submissions.filter((s) =>
    (approvedOverrides[s.id] || s.subStatus) === 'Approved'
  ).length
  const notApprovedCount = submissions.filter((s) =>
    (approvedOverrides[s.id] || s.subStatus) === 'Not Approved'
  ).length

  return (
    <div className="generic-popup-overlay">
      <div className="submissions-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faFileLines} /> Assignment Submissions — {assignment.name}
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="submissions-stat-row">
          <div className="submissions-stat-box">
            <FontAwesomeIcon icon={faFileLines} className="assignment-stat-icon" />
            <span className="assignment-stat-value">{submittedCount}</span>
            <span className="assignment-stat-label">Submitted</span>
          </div>
          <div className="submissions-stat-box">
            <FontAwesomeIcon icon={faCircleCheck} className="assignment-stat-icon" />
            <span className="assignment-stat-value">{approvedCount}</span>
            <span className="assignment-stat-label">Approved</span>
          </div>
          <div className="submissions-stat-box">
            <FontAwesomeIcon icon={faCircleXmark} className="assignment-stat-icon" />
            <span className="assignment-stat-value">{notApprovedCount}</span>
            <span className="assignment-stat-label">Not Approved</span>
          </div>
        </div>

        <div className="submissions-body">
          <div className="submissions-list-col">
            <div className="course-landing-search-wrap submissions-search">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="course-landing-search-icon" />
              <input
                type="text"
                className="course-landing-search-input"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filtered.map((s) => {
              const status = approvedOverrides[s.id] || s.subStatus
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`submissions-student-item ${selected?.id === s.id ? 'submissions-student-item-active' : ''}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span>{s.name}</span>
                  <span className={`assignment-status-chip assignment-status-${status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {status}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="submissions-detail-col">
            {selected && (
              <>
                <h4 className="submissions-detail-name">{selected.name}</h4>
                <p className="assignment-view-label">Status</p>
                <p className={`assignment-status-chip assignment-status-${selectedStatus.replace(/\s+/g, '-').toLowerCase()}`}>
                  {selectedStatus}
                </p>

                {selectedStatus !== 'Not Submitted' ? (
                  <>
                    <p className="assignment-view-label">Submission Link</p>
                    <div className="assignment-view-link-box">
                      https://github.com/{selected.name.toLowerCase().replace(/\s+/g, '-')}/{assignment.name.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                    <p className="assignment-view-label">Description</p>
                    <div className="assignment-view-notes-box">
                      Completed the task as per the requirements discussed in class.
                    </div>

                    <button
                      type="button"
                      className="submissions-approve-btn"
                      disabled={selectedStatus === 'Approved'}
                      onClick={() => setApprovedOverrides({ ...approvedOverrides, [selected.id]: 'Approved' })}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} /> {selectedStatus === 'Approved' ? 'Approved' : 'Approve Submission'}
                    </button>
                  </>
                ) : (
                  <p className="submissions-empty-note">
                    <FontAwesomeIcon icon={faClock} /> This student hasn't submitted this assignment yet.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewSubmissionsPopup
