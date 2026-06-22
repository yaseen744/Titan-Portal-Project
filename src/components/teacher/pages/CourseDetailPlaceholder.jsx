import { useParams } from 'react-router-dom'
import TeacherPageHeader from '../layout/TeacherPageHeader.jsx'
import ComingSoonNotice from './ComingSoonNotice.jsx'

function CourseDetailPlaceholder() {
  const { courseId } = useParams()

  return (
    <div>
      <TeacherPageHeader crumbs={['Dashboard', courseId]} />
      <ComingSoonNotice
        icon="fa-solid fa-laptop-code"
        title="Course detail is coming next"
        text="The students list, attendance, assignments, quizzes, and course-progress tabs for this batch will be built in the next phase."
      />
    </div>
  )
}

export default CourseDetailPlaceholder
