import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import { getAssignmentsForCourse } from '../data/teacherData.js'
import NewAssignmentPopup from '../Popups/NewAssignmentPopup.jsx'
import ViewSubmissionsPopup from '../Popups/ViewSubmissionsPopup.jsx'

function CourseAssignmentsTab({ course }) {
  const assignments = useMemo(() => getAssignmentsForCourse(course), [course])
  const [showNew, setShowNew] = useState(false)
  const [viewing, setViewing] = useState(null) // { assignment, index }

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

      {assignments.map((a, idx) => (
        <div key={a.id} className="teacher-assignment-list-row">
          <span className="assignment-row-name">{a.name}</span>
          <span className="assignment-row-course">Submit via GitHub / project link</span>
          <span>{a.type}</span>
          <span>{a.dueDate}</span>
          <span>
            <FontAwesomeIcon
              icon={faEye}
              className="assignment-action-icon"
              onClick={() => setViewing({ assignment: a, index: idx })}
              title="View Submissions"
            />
          </span>
          <span className="teacher-assignment-no-action">—</span>
        </div>
      ))}

      <NewAssignmentPopup show={showNew} onClose={() => setShowNew(false)} />

      {viewing && (
        <ViewSubmissionsPopup
          assignment={viewing.assignment}
          assignmentIndex={viewing.index}
          course={course}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  )
}

export default CourseAssignmentsTab
