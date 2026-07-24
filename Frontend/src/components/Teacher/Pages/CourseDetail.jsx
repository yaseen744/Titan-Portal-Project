import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faChevronDown, faUserGroup, faCalendarCheck,
  faFileLines, faFileCircleQuestion, faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import TeacherTopbar from '../Layout/TeacherTopbar.jsx'
import CourseStudentsTab from './CourseStudentsTab.jsx'
import CourseAttendanceTab from './CourseAttendanceTab.jsx'
import CourseAssignmentsTab from './CourseAssignmentsTab.jsx'
import CourseQuizzesTab from './CourseQuizzesTab.jsx'
import CourseProgressTab from './CourseProgressTab.jsx'
import api from '../../../api/axios.js'

const tabs = [
  { id: 'students', label: 'Students', icon: faUserGroup },
  { id: 'attendance', label: 'Attendance', icon: faCalendarCheck },
  { id: 'assignments', label: 'Assignments', icon: faFileLines },
  { id: 'quizzes', label: 'Quizzes', icon: faFileCircleQuestion },
  { id: 'progress', label: 'Course Progress', icon: faChartLine },
]

function CourseDetail() {
  const { courseId } = useParams() // this is actually the batchId
  const [course, setCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('students')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.get(`/teacher/courses/${courseId}`)
      .then(({ data }) => {
        setCourse({
          id: data.course._id,
          batchId: data.course._id,
          courseId: data.course.courseId,
          title: data.course.courseName,
          batchLabel: data.course.batchNumber,
          campus: data.course.campus,
          city: data.course.city,
        })
        setStudents(
          (data.students || []).map((s) => ({
            id: s._id,
            name: s.name,
            roll: s.rollNumber,
            photo: s.profilePic,
            email: s.email,
            status: s.enrollmentStatus === 'dropped' ? 'Dropped' : 'Enrolled',
          }))
        )
      })
      .catch((err) => console.error('Could not load course detail', err))
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) {
    return (
      <div className="teacher-page">
        <p>Loading course...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="teacher-page">
        <p>Course not found.</p>
      </div>
    )
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'All' || (filter === 'Enrolled' && s.status === 'Enrolled'))
  )

  return (
    <div className="teacher-page">
      <TeacherTopbar breadcrumb={['Home', 'Dashboard', course.title]} />

      <div className="course-detail-header-row">
        <h2 className="course-detail-title">{course.title} ({course.batchLabel})</h2>

        <div className="course-detail-search-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="course-landing-search-icon" />
          <input
            type="text"
            className="course-landing-search-input"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="course-landing-filter-wrap">
          <button type="button" className="course-landing-filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
            {filter} <FontAwesomeIcon icon={faChevronDown} />
          </button>
          {filterOpen && (
            <div className="course-landing-filter-menu">
              {['All', 'Enrolled'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="course-landing-filter-item"
                  onClick={() => {
                    setFilter(opt)
                    setFilterOpen(false)
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="course-detail-tab-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`course-detail-tab-btn ${activeTab === tab.id ? 'course-detail-tab-btn-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'students' && <CourseStudentsTab course={course} students={filteredStudents} />}
      {activeTab === 'attendance' && <CourseAttendanceTab course={course} />}
      {activeTab === 'assignments' && <CourseAssignmentsTab course={course} />}
      {activeTab === 'quizzes' && <CourseQuizzesTab course={course} />}
      {activeTab === 'progress' && <CourseProgressTab course={course} />}
    </div>
  )
}

export default CourseDetail
