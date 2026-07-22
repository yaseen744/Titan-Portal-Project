import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarCheck, faFileLines, faChalkboard, faFileCircleQuestion,
  faLightbulb, faCalendarDay, faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons'
import StudentTopbar from '../Layout/StudentTopbar.jsx'
import CourseSummaryCard from './CourseSummaryCard.jsx'
import { payments } from '../data/studentData.js'
import { getCurrentWeekDates, dayName } from '../../Media/dateUtils.js'
import api from '../../../api/axios.js'
import { updateStudentFields } from '../../../api/session.js'

const activityTabs = [
  { id: 'assignments', label: 'Assignments', icon: faFileLines, message: 'No Upcoming Assignments' },
  { id: 'quizzes', label: 'Quizzes', icon: faFileCircleQuestion, message: 'No Upcoming Quizzes' },
  { id: 'events', label: 'Events', icon: faLightbulb, message: 'No Upcoming Events' },
]

function Dashboard() {
  const navigate = useNavigate()
  const { openFeedback } = useOutletContext()
  const [activeTab, setActiveTab] = useState('quizzes')
  const weekDates = getCurrentWeekDates()
  const currentChallan = payments[0]

  // Real data from the backend - assignments count comes from /dashboard,
  // attendance percentage comes from /attendance.
  const [assignmentsTotal, setAssignmentsTotal] = useState(0)
  const [attendancePercent, setAttendancePercent] = useState(0)

  useEffect(() => {
    api.get('/student/dashboard')
      .then(({ data }) => {
        setAssignmentsTotal(data.assignmentsCount || 0)
        // keep the cached session in sync with populated course/batch info
        if (data.student) updateStudentFields(data.student)
      })
      .catch((err) => console.error('Could not load dashboard data', err))

    api.get('/student/attendance')
      .then(({ data }) => setAttendancePercent(data.percentage || 0))
      .catch((err) => console.error('Could not load attendance data', err))
  }, [])

  return (
    <div className="student-page">
      <StudentTopbar breadcrumb={['Home', 'Dashboard']} onFeedbackClick={openFeedback} />

      <div className="dashboard-top-row">
        <button type="button" className="dashboard-stat-card" onClick={() => navigate('/student/attendance')}>
          <FontAwesomeIcon icon={faCalendarCheck} className="dashboard-stat-icon" />
          <span className="dashboard-stat-value">{attendancePercent}%</span>
          <span className="dashboard-stat-label">Attendance</span>
        </button>

        <button type="button" className="dashboard-stat-card" onClick={() => navigate('/student/assignment')}>
          <FontAwesomeIcon icon={faFileLines} className="dashboard-stat-icon" />
          <span className="dashboard-stat-value">{assignmentsTotal}</span>
          <span className="dashboard-stat-label">Assignments</span>
        </button>

        <div className="dashboard-schedule-card">
          <span className="dashboard-schedule-heading">
            <FontAwesomeIcon icon={faCalendarDay} /> Class Schedule
          </span>
          <div className="dashboard-schedule-days">
            {weekDates.map((d) => {
              const dname = dayName(d)
              const isClassDay = ['Mon', 'Wed', 'Fri'].includes(dname)
              return (
                <div key={d.toISOString()} className={`dashboard-day-box ${isClassDay ? 'dashboard-day-box-active' : ''}`}>
                  <span className="dashboard-day-name">{dname}</span>
                  <span className="dashboard-day-date">{d.getDate()}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <h3 className="student-section-heading">Active Course</h3>

      <div className="dashboard-active-course-row">
        <div className="dashboard-active-course-left">
          <CourseSummaryCard showSchedule />
        </div>

        <div className="dashboard-active-course-right">
          <div className="activity-tab-row">
            {activityTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`activity-tab-btn ${activeTab === tab.id ? 'activity-tab-btn-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <FontAwesomeIcon icon={tab.icon} /> {tab.label}
              </button>
            ))}
          </div>
          <div className="activity-tab-content">
            <FontAwesomeIcon icon={faChalkboard} className="activity-tab-content-icon" />
            <p>{activityTabs.find((t) => t.id === activeTab)?.message}</p>
          </div>
        </div>
      </div>

      <h3 className="student-section-heading">
        <FontAwesomeIcon icon={faMoneyBillWave} /> Fee
      </h3>

      <div className="fee-challan-box">
        <div className="fee-challan-header">
          <span>Month</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Due Date</span>
          <span>Voucher ID</span>
          <span>Status</span>
        </div>
        <div className="fee-challan-row">
          <span>{currentChallan.month}</span>
          <span>{currentChallan.amount}</span>
          <span>{currentChallan.type}</span>
          <span>{currentChallan.dueDate}</span>
          <span>{currentChallan.voucherId}</span>
          <span className="fee-status-paid">{currentChallan.status}</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
