import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faFileLines, faMagnifyingGlass, faCircleCheck, faCircleXmark, faClock,
} from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/axios.js'

function statusLabel(status) {
  if (status === 'approved') return 'Approved'
  if (status === 'disapproved') return 'Not Approved'
  if (status === 'late') return 'Late'
  if (status === 'submitted') return 'Submitted'
  return 'Not Submitted'
}

function ViewSubmissionsPopup({ assignment, course, onClose }) {
  const [submissions, setSubmissions] = useState([]) // merged: students + their submission (or none)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [approving, setApproving] = useState(false)

  const load = () => {
    Promise.all([
      api.get(`/teacher/assignments/${assignment.id}/submissions`),
      api.get(`/teacher/courses/${course.batchId}`),
    ]).then(([subRes, courseRes]) => {
      const subs = subRes.data.submissions || []
      const allStudents = courseRes.data.students || []

      const merged = allStudents.map((s) => {
        const sub = subs.find((sub) => String(sub.student._id) === String(s._id))
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
          id: s._id,
          submissionId: sub?._id || null,
          name: s.name,
          status: statusLabel(sub?.status),
          link,
          notes,
        }
      })
      setSubmissions(merged)
      if (merged.length) setSelectedId((prev) => prev || merged[0].id)
    }).catch((err) => console.error('Could not load submissions', err))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment])

  if (!assignment) return null

  const filtered = submissions.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  const selected = submissions.find((s) => s.id === selectedId) || submissions[0]

  const submittedCount = submissions.filter((s) => s.status !== 'Not Submitted').length
  const approvedCount = submissions.filter((s) => s.status === 'Approved').length
  const notApprovedCount = submissions.filter((s) => s.status === 'Not Approved').length

  const handleApprove = async () => {
    if (!selected?.submissionId) return
    setApproving(true)
    try {
      await api.put(`/teacher/submissions/${selected.submissionId}`, { status: 'approved' })
      load()
    } catch (err) {
      console.error('Could not approve submission', err)
    } finally {
      setApproving(false)
    }
  }

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
            {filtered.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`submissions-student-item ${selected?.id === s.id ? 'submissions-student-item-active' : ''}`}
                onClick={() => setSelectedId(s.id)}
              >
                <span>{s.name}</span>
                <span className={`assignment-status-chip assignment-status-${s.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {s.status}
                </span>
              </button>
            ))}
          </div>

          <div className="submissions-detail-col">
            {selected && (
              <>
                <h4 className="submissions-detail-name">{selected.name}</h4>
                <p className="assignment-view-label">Status</p>
                <p className={`assignment-status-chip assignment-status-${selected.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {selected.status}
                </p>

                {selected.status !== 'Not Submitted' ? (
                  <>
                    <p className="assignment-view-label">Submission Link</p>
                    <div className="assignment-view-link-box">{selected.link || 'No link provided'}</div>
                    <p className="assignment-view-label">Description</p>
                    <div className="assignment-view-notes-box">{selected.notes || 'No description provided'}</div>

                    <button
                      type="button"
                      className="submissions-approve-btn"
                      disabled={selected.status === 'Approved' || approving}
                      onClick={handleApprove}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />{' '}
                      {selected.status === 'Approved' ? 'Approved' : approving ? 'Approving...' : 'Approve Submission'}
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
