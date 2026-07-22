import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faChevronDown, faUserGroup, faCalendarCheck,
  faFileLines, faFileCircleQuestion, faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import TeacherTopbar from '../Layout/TeacherTopbar.jsx'
import { courses } from '../data/teacherData.js'
import CourseStudentsTab from './CourseStudentsTab.jsx'
import CourseAttendanceTab from './CourseAttendanceTab.jsx'
import CourseAssignmentsTab from './CourseAssignmentsTab.jsx'
import CourseQuizzesTab from './CourseQuizzesTab.jsx'
import CourseProgressTab from './CourseProgressTab.jsx'

const tabs = [
  { id: 'students', label: 'Students', icon: faUserGroup },
  { id: 'attendance', label: 'Attendance', icon: faCalendarCheck },
  { id: 'assignments', label: 'Assignments', icon: faFileLines },
  { id: 'quizzes', label: 'Quizzes', icon: faFileCircleQuestion },
  { id: 'progress', label: 'Course Progress', icon: faChartLine },
]

function CourseDetail() {
  const { courseId } = useParams()
  const course = useMemo(() => courses.find((c) => c.id === courseId), [courseId])
  const [activeTab, setActiveTab] = useState('students')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState('All')

  if (!course) {
    return (
      <div className="teacher-page">
        <p>Course not found.</p>
      </div>
    )
  }

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

      {activeTab === 'students' && <CourseStudentsTab course={course} search={search} />}
      {activeTab === 'attendance' && <CourseAttendanceTab course={course} />}
      {activeTab === 'assignments' && <CourseAssignmentsTab course={course} />}
      {activeTab === 'quizzes' && <CourseQuizzesTab course={course} />}
      {activeTab === 'progress' && <CourseProgressTab course={course} />}
    </div>
  )
}

export default CourseDetail
