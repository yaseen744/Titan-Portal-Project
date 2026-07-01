import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardUser, faUserGroup, faFileLines, faCalendarDay,
  faIdBadge, faSchool, faCalendarDays, faUsers,
} from '@fortawesome/free-solid-svg-icons'
import TeacherTopbar from '../Layout/TeacherTopbar.jsx'
import { courses, totalStudents } from '../data/teacherData.js'
import { getCurrentWeekDates, dayName } from '../../Media/dateUtils.js'

const scheduleDayNames = ['Sun', 'Mon', 'Wed', 'Fri', 'Sat']

function TeacherDashboard() {
  const navigate = useNavigate()
  const weekDates = getCurrentWeekDates()

  return (
    <div className="teacher-page">
      <TeacherTopbar breadcrumb={['Home', 'Dashboard']} />

      <div className="teacher-stat-row">
        <div className="teacher-stat-card">
          <FontAwesomeIcon icon={faChalkboardUser} className="teacher-stat-icon" />
          <span className="teacher-stat-value">{courses.length}</span>
          <span className="teacher-stat-label">Active Course</span>
        </div>
        <div className="teacher-stat-card">
          <FontAwesomeIcon icon={faUserGroup} className="teacher-stat-icon" />
          <span className="teacher-stat-value">{totalStudents}</span>
          <span className="teacher-stat-label">Enrolled Students</span>
        </div>
        <div className="teacher-stat-card">
          <FontAwesomeIcon icon={faFileLines} className="teacher-stat-icon" />
          <span className="teacher-stat-value">0</span>
          <span className="teacher-stat-label">Total Assignments</span>
        </div>

        <div className="teacher-schedule-card">
          <span className="teacher-schedule-heading">
            <FontAwesomeIcon icon={faCalendarDay} /> Class Schedule
          </span>
          <div className="teacher-schedule-days">
            {weekDates.map((d) => {
              const dname = dayName(d)
              const isClassDay = scheduleDayNames.includes(dname)
              return (
                <div key={d.toISOString()} className={`teacher-day-box ${isClassDay ? 'teacher-day-box-active' : ''}`}>
                  <span className="teacher-day-name">{dname}</span>
                  <span className="teacher-day-date">{d.getDate()}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <h3 className="teacher-section-heading">Active Courses</h3>

      <div className="teacher-course-grid">
        {courses.map((course) => (
          <button
            key={course.id}
            type="button"
            className={`teacher-course-card teacher-course-card-${course.colorTheme}`}
            onClick={() => navigate(`/teacher/course/${course.id}`)}
          >
            <h4 className="teacher-course-title">{course.title}</h4>
            <div className="teacher-course-meta-row">
              <span className="teacher-course-lab">
                <FontAwesomeIcon icon={faUsers} /> Lab: {course.lab}
              </span>
              <span className="teacher-course-batch-badge">{course.batchLabel}</span>
            </div>
            <p className="teacher-course-campus">
              <FontAwesomeIcon icon={faSchool} /> {course.campus}
            </p>

            <div className="teacher-course-progress-row">
              <span>Progress</span>
              <span>{course.progressPercent}% Complete</span>
            </div>
            <div className="teacher-course-progress-track">
              <div className="teacher-course-progress-fill" style={{ width: `${course.progressPercent}%` }}></div>
            </div>

            <p className="teacher-course-enrolled">
              <FontAwesomeIcon icon={faIdBadge} /> Enrolled: {course.studentsCount} Students
            </p>
            <p className="teacher-course-schedule">
              <FontAwesomeIcon icon={faCalendarDays} /> {course.schedule}
            </p>
            <p className="teacher-course-start">Start: {course.startDate}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TeacherDashboard
