import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardUser, faUserGroup, faFileLines, faCalendarDay,
  faIdBadge, faSchool, faCalendarDays, faUsers,
} from '@fortawesome/free-solid-svg-icons'
import TeacherTopbar from '../Layout/TeacherTopbar.jsx'
import { getCurrentWeekDates, dayName } from '../../Media/dateUtils.js'
import api from '../../../api/axios.js'
import { updateTeacherFields } from '../../../api/session.js'

const CARD_THEMES = ['green', 'blue', 'red', 'silver']

function TeacherDashboard() {
  const navigate = useNavigate()
  const weekDates = getCurrentWeekDates()

  const [courses, setCourses] = useState([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalAssignments, setTotalAssignments] = useState(0)
  const [scheduleDayNames, setScheduleDayNames] = useState([])

  useEffect(() => {
    api.get('/teacher/dashboard')
      .then(({ data }) => {
        if (data.teacher) updateTeacherFields(data.teacher)
        setTotalStudents(data.enrolledStudents || 0)
        setTotalAssignments(data.totalAssignments || 0)
        setScheduleDayNames(data.scheduleDays || [])
        setCourses(
          (data.courses || []).map((c, idx) => ({
            id: c._id,
            title: c.courseName,
            lab: c.campus || c.city,
            batchLabel: c.batchNumber,
            campus: c.campus,
            progressPercent: c.progressPercent,
            studentsCount: c.enrolledCount,
            schedule: `${(c.days || []).join(', ')}${c.time ? ' | ' + c.time : ''}`,
            startDate: c.startDate ? new Date(c.startDate).toLocaleDateString() : 'Not set',
            colorTheme: CARD_THEMES[idx % CARD_THEMES.length],
          }))
        )
      })
      .catch((err) => console.error('Could not load teacher dashboard', err))
  }, [])

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
          <span className="teacher-stat-value">{totalAssignments}</span>
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
