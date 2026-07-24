import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import NewAssignmentPopup from '../Popups/NewAssignmentPopup.jsx'
import ViewSubmissionsPopup from '../Popups/ViewSubmissionsPopup.jsx'
import api from '../../../api/axios.js'

function CourseAssignmentsTab({ course }) {
  const [assignments, setAssignments] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [viewing, setViewing] = useState(null) // assignment object

  const loadAssignments = () => {
    api.get('/teacher/assignments', { params: { batchId: course.batchId } })
      .then(({ data }) => {
        setAssignments(
          (data.assignments || []).map((a) => ({
            id: a._id,
            name: a.name,
            type: a.type,
            dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '',
          }))
        )
      })
      .catch((err) => console.error('Could not load assignments', err))
  }

  useEffect(() => {
    loadAssignments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.batchId])

  return (
    <div className="course-tab-box">
      <div className="course-tab-header-row">
        <h4 className="course-tab-heading">Assignments</h4>
        <button type="button" className="course-tab-new-btn" onClick={() => setShowNew(true)}>
          <FontAwesomeIcon icon={faPlus} /> New Assignment
        </button>
      </div>

      <div className="teacher-assignment-list-head">
        <span>Assignment</span>
        <span>Description</span>
        <span>Type</span>
        <span>Due Date</span>
        <span>View</span>
        <span>Action</span>
      </div>

      {assignments.map((a) => (
        <div key={a.id} className="teacher-assignment-list-row">
          <span className="assignment-row-name">{a.name}</span>
          <span className="assignment-row-course">Submit via GitHub / project link</span>
          <span>{a.type}</span>
          <span>{a.dueDate}</span>
          <span>
            <FontAwesomeIcon
              icon={faEye}
              className="assignment-action-icon"
              onClick={() => setViewing(a)}
              title="View Submissions"
            />
          </span>
          <span className="teacher-assignment-no-action">—</span>
        </div>
      ))}

      <NewAssignmentPopup
        show={showNew}
        onClose={() => setShowNew(false)}
        course={course}
        onCreated={loadAssignments}
      />

      {viewing && (
        <ViewSubmissionsPopup
          assignment={viewing}
          course={course}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  )
}

export default CourseAssignmentsTab
