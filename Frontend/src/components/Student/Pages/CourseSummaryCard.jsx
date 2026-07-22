import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap, faIdBadge, faSchool, faCity, faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'
import { classSchedule } from '../data/studentData.js'
import { getStudentInfo } from '../../../api/session.js'

function CourseSummaryCard({ showSchedule = false, onViewDetail }) {
  const studentInfo = getStudentInfo() || { batch: '', rollNo: '', campus: '', city: '' }

  return (
    <div className="course-card">
      <div className="course-card-header">
        <h3 className="course-card-heading">
          <FontAwesomeIcon icon={faGraduationCap} /> Modern Web Application Development (WMA)
        </h3>
        <span className="course-card-enrolled-badge">Enrolled</span>
      </div>

      {showSchedule && (
        <div className="course-card-schedule-row">
          {classSchedule.map((s) => (
            <div key={s.day} className="course-card-schedule-box">
              <span className="course-card-schedule-day">{s.day}</span>
              <span className="course-card-schedule-time">{s.time}</span>
            </div>
          ))}
        </div>
      )}

      <div className="course-card-progress-row">
        <span className="course-card-progress-label">Progress</span>
        <span className="course-card-progress-percent">80%</span>
      </div>
      <div className="course-card-progress-track">
        <div className="course-card-progress-fill" style={{ width: '80%' }}></div>
      </div>

      <div className="course-card-meta-row">
        <span className="course-card-meta-item">
          <FontAwesomeIcon icon={faIdBadge} /> Batch: {studentInfo.batch}
        </span>
        <span className="course-card-meta-item">
          <FontAwesomeIcon icon={faIdBadge} /> Roll: {studentInfo.rollNo}
        </span>
      </div>
      <div className="course-card-meta-row">
        <span className="course-card-meta-item">
          <FontAwesomeIcon icon={faSchool} /> Campus: {studentInfo.campus}
        </span>
        <span className="course-card-meta-item">
          <FontAwesomeIcon icon={faCity} /> City: {studentInfo.city}
        </span>
      </div>

      {onViewDetail && (
        <button type="button" className="course-card-view-detail-btn" onClick={onViewDetail}>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> View Detail
        </button>
      )}
    </div>
  )
}

export default CourseSummaryCard
