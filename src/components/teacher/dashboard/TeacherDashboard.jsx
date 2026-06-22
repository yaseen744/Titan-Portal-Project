import { useNavigate } from 'react-router-dom'
import TeacherPageHeader from '../layout/TeacherPageHeader.jsx'
import './TeacherDashboard.css'

const weekDays = [
  { short: 'Sun', highlighted: true },
  { short: 'Mon', highlighted: true },
  { short: 'Tue', highlighted: false },
  { short: 'Wed', highlighted: true },
  { short: 'Thu', highlighted: false },
  { short: 'Fri', highlighted: true },
  { short: 'Sat', highlighted: true },
]

const statCards = [
  { icon: 'fa-solid fa-book-open', value: '4', label: 'Active Course' },
  { icon: 'fa-solid fa-user-graduate', value: '102', label: 'Enrolled Students' },
  { icon: 'fa-solid fa-file-pen', value: '0', label: 'Total Assignments' },
]

const courseCards = [
  {
    id: 'little-geniuses-batch-1',
    tintClass: 'teacherCourseTintGreen',
    title: 'little Geniuses: Coding, Design & Fun Lab',
    batch: 'Batch-1',
    lab: 'Lab | Male',
    campus: 'SMIT GHOTKI CAMPUS (Ghotki)',
    progress: 74,
    enrolled: 27,
    schedule: 'Sat 04:00pm-06:00pm | Sun 04:00pm-06:00pm',
    startDate: 'Started Oct 11, 2025',
  },
  {
    id: 'little-geniuses-batch-2',
    tintClass: 'teacherCourseTintBlue',
    title: 'little Geniuses: Coding, Design & Fun Lab',
    batch: 'Batch-2',
    lab: 'Lab | Female',
    campus: 'SMIT GHOTKI CAMPUS (Ghotki)',
    progress: 68,
    enrolled: 25,
    schedule: 'Sat 02:00pm-04:00pm | Sun 02:00pm-04:00pm',
    startDate: 'Started Oct 18, 2025',
  },
  {
    id: 'mwad-batch-1',
    tintClass: 'teacherCourseTintRed',
    title: 'Modern Web Application Development',
    batch: 'Batch-1',
    lab: 'Lab | Men',
    campus: 'SMIT SUKKUR CAMPUS (Sukkur)',
    progress: 80,
    enrolled: 20,
    schedule: 'Mon 04:00pm-06:00pm | Wed 04:00pm-06:00pm | Fri 04:00pm-06:00pm',
    startDate: 'Started Sep 29, 2025',
  },
  {
    id: 'mwad-batch-2',
    tintClass: 'teacherCourseTintSilver',
    title: 'Modern Web Application Development',
    batch: 'Batch-2',
    lab: 'Lab | Men',
    campus: 'SMIT SUKKUR CAMPUS (Sukkur)',
    progress: 65,
    enrolled: 30,
    schedule: 'Mon 02:00pm-04:00pm | Wed 02:00pm-04:00pm | Fri 02:00pm-04:00pm',
    startDate: 'Started Oct 6, 2025',
  },
]

function TeacherDashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <TeacherPageHeader crumbs={['Dashboard']} />

      <div className="teacherDashboardStatsRow">
        {statCards.map((card) => (
          <div key={card.label} className="teacherDashboardStatCard">
            <div className="teacherDashboardStatIcon">
              <i className={card.icon}></i>
            </div>
            <div className="teacherDashboardStatValue">{card.value}</div>
            <div className="teacherDashboardStatLabel">{card.label}</div>
          </div>
        ))}

        <div className="teacherDashboardStatCard teacherDashboardScheduleCard">
          <div className="teacherDashboardScheduleHeading">
            <i className="fa-solid fa-calendar-week"></i> Weekly Schedule
          </div>
          <div className="teacherDashboardScheduleDays">
            {weekDays.map((day) => (
              <span
                key={day.short}
                className={
                  day.highlighted
                    ? 'teacherDashboardScheduleDay teacherDashboardScheduleDayActive'
                    : 'teacherDashboardScheduleDay'
                }
              >
                {day.short}
              </span>
            ))}
          </div>
        </div>
      </div>

      <h2 className="teacherDashboardSectionHeading">Active Courses</h2>

      <div className="teacherDashboardCoursesGrid">
        {courseCards.map((course) => (
          <button
            key={course.id}
            type="button"
            className="teacherCourseCard"
            onClick={() => navigate(`/teacher/course/${course.id}`)}
          >
            <div className={`teacherCourseCardTopTint ${course.tintClass}`}>
              <span className="teacherCourseBatchBadge">{course.batch}</span>
              <h3 className="teacherCourseTitle">
                <i className="fa-solid fa-laptop-code"></i> {course.title}
              </h3>
              <p className="teacherCourseLabText">{course.lab}</p>
              <p className="teacherCourseCampusText">
                <i className="fa-solid fa-location-dot"></i> {course.campus}
              </p>
            </div>

            <div className="teacherCourseBottomWhite">
              <div className="teacherCourseProgressRow">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="teacherCourseProgressTrack">
                <div
                  className="teacherCourseProgressFill"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>

              <div className="teacherCourseEnrolledRow">
                <i className="fa-solid fa-users"></i> Enrolled: {course.enrolled} students
              </div>

              <div className="teacherCourseScheduleRow">
                <i className="fa-regular fa-clock"></i> {course.schedule}
              </div>

              <div className="teacherCourseStartRow">
                <i className="fa-regular fa-calendar"></i> {course.startDate}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TeacherDashboard
