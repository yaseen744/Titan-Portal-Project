import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { getStudentsForCourse } from '../data/teacherData.js'
import StudentDetailPopup from '../Popups/StudentDetailPopup.jsx'
import Avatar from '../../Media/Avatar.jsx'

const PAGE_SIZE = 8

function CourseStudentsTab({ course, search }) {
  const allStudents = useMemo(() => getStudentsForCourse(course), [course])
  const filtered = useMemo(
    () => allStudents.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [allStudents, search]
  )
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState(null)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const pageItems = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="course-tab-box">
      <div className="student-row-head">
        <span>Photo</span>
        <span>Name</span>
        <span>Roll No</span>
        <span>Email</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      {pageItems.map((s) => (
        <div key={s.id} className="student-row">
          <Avatar name={s.name} photoUrl={s.photo} className="student-row-photo" />
          <span className="student-row-name">{s.name}</span>
          <span>{s.roll}</span>
          <span className="student-row-email">{s.email}</span>
          <span className="student-row-status">{s.status}</span>
          <span>
            <FontAwesomeIcon icon={faEye} className="assignment-action-icon" onClick={() => setViewing(s)} title="View" />
          </span>
        </div>
      ))}

      <div className="assignment-pagination-row">
        <span className="assignment-pagination-text">
          Showing {start + 1}-{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} records
        </span>
        <div className="assignment-pagination-btns">
          <button type="button" className="assignment-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </button>
          <button type="button" className="assignment-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {viewing && <StudentDetailPopup student={viewing} course={course} onClose={() => setViewing(null)} />}
    </div>
  )
}

export default CourseStudentsTab
