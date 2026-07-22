import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserGraduate, faUserCheck, faBookOpen, faCity, faSchool, faChalkboardUser,
  faLayerGroup, faLockOpen, faArrowUpWideShort, faArrowDownWideShort,
  faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import SubAdminTopbar from '../Layout/SubAdminTopbar.jsx'
import {
  students, trainers, slots, citiesByCountry, coursesByCampus, adminInfo,
  studentsPerCampus, studentsPerCourse,
} from '../data/subAdminData.js'

const CHART_PAGE_SIZE = 5

function SortableBarChart({ title, data }) {
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    const copy = [...data]
    copy.sort((a, b) => (sortDir === 'desc' ? b.count - a.count : a.count - b.count))
    return copy
  }, [data, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / CHART_PAGE_SIZE))
  const start = (page - 1) * CHART_PAGE_SIZE
  const pageData = sorted.slice(start, start + CHART_PAGE_SIZE)

  return (
    <div className="subadmin-chart-box">
      <div className="subadmin-chart-header">
        <h4 className="subadmin-chart-title">{title}</h4>
        <button
          type="button"
          className="subadmin-sort-btn"
          onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
        >
          <FontAwesomeIcon icon={sortDir === 'desc' ? faArrowDownWideShort : faArrowUpWideShort} />
          {sortDir === 'desc' ? 'High to Low' : 'Low to High'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={pageData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,77,0.08)" />
          <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={60} tick={{ fontSize: 11, fill: '#6B7280' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
          <Tooltip />
          <Bar dataKey="count" fill="#C9A227" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="assignment-pagination-row">
        <span className="assignment-pagination-text">
          Showing {start + 1}-{Math.min(start + CHART_PAGE_SIZE, sorted.length)} of {sorted.length}
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
    </div>
  )
}

function Dashboard() {
  const myCampusStudents = students.filter((s) => s.campus === adminInfo.campus)
  const myCampusTrainers = trainers.filter((t) => t.campus === adminInfo.campus)
  const myCampusSlots = slots.filter((s) => s.campus === adminInfo.campus)
  const myCampusCourses = [...new Set(myCampusStudents.map((s) => s.course))]
  const enrolledAtMyCampus = myCampusStudents.filter((s) => s.status === 'enrolled' || s.status === 'approved').length
  const totalCities = citiesByCountry.Pakistan.length
  const totalCampuses = Object.keys(coursesByCampus).length

  const stats = [
    { label: 'Total Students (My Campus)', value: myCampusStudents.length, icon: faUserGraduate },
    { label: 'Enrolled Students', value: enrolledAtMyCampus, icon: faUserCheck },
    { label: 'Courses Offered Here', value: myCampusCourses.length, icon: faBookOpen },
    { label: 'Total Cities (Org-wide)', value: totalCities, icon: faCity },
    { label: 'Total Campuses (Org-wide)', value: totalCampuses, icon: faSchool },
    { label: 'Trainers (My Campus)', value: myCampusTrainers.length, icon: faChalkboardUser },
    { label: 'Active Slots (My Campus)', value: myCampusSlots.length, icon: faLayerGroup },
    { label: 'Registration Open', value: myCampusSlots.filter((s) => s.registrationOpen).length, icon: faLockOpen },
  ]

  return (
    <div className="subadmin-page">
      <SubAdminTopbar breadcrumb={['Home', 'Dashboard']} />

      <div className="subadmin-stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="subadmin-stat-card">
            <FontAwesomeIcon icon={s.icon} className="subadmin-stat-icon" />
            <span className="subadmin-stat-value">{s.value}</span>
            <span className="subadmin-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="subadmin-charts-row">
        <SortableBarChart title="Students per Campus (Org-wide)" data={studentsPerCampus} />
        <SortableBarChart title="Students per Course (Org-wide)" data={studentsPerCourse} />
      </div>
    </div>
  )
}

export default Dashboard
