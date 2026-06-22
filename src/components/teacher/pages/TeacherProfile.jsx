import TeacherPageHeader from '../layout/TeacherPageHeader.jsx'
import ComingSoonNotice from './ComingSoonNotice.jsx'

function TeacherProfile() {
  return (
    <div>
      <TeacherPageHeader crumbs={['Dashboard', 'Profile']} />
      <ComingSoonNotice
        icon="fa-solid fa-id-badge"
        title="Profile page is coming next"
        text="The full profile page (contact info, personal info, social links, change password) will be built in the next phase."
      />
    </div>
  )
}

export default TeacherProfile
