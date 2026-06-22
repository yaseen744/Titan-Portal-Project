import TeacherPageHeader from '../layout/TeacherPageHeader.jsx'
import ComingSoonNotice from './ComingSoonNotice.jsx'

function TeacherCalendar() {
  return (
    <div>
      <TeacherPageHeader crumbs={['Dashboard', 'Calendar']} />
      <ComingSoonNotice
        icon="fa-solid fa-calendar-days"
        title="Calendar is coming next"
        text="The month-by-month class calendar (with the back / next month navigation) will be built in the next phase, right after the dashboard is approved."
      />
    </div>
  )
}

export default TeacherCalendar
