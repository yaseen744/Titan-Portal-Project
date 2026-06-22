import TeacherPageHeader from '../layout/TeacherPageHeader.jsx'
import ComingSoonNotice from './ComingSoonNotice.jsx'

function TeacherAttendance() {
  return (
    <div>
      <TeacherPageHeader crumbs={['Dashboard', 'Attendance']} />
      <ComingSoonNotice
        icon="fa-solid fa-clipboard-check"
        title="Attendance is coming next"
        text="The date-wise attendance view (course selector, overall stats, and per-student records) will be built in the next phase."
      />
    </div>
  )
}

export default TeacherAttendance
