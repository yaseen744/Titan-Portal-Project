import { Navigate, Route, Routes } from 'react-router-dom'
import PortalLanding from './components/common/Auth/PortalLanding.jsx'
import TeacherLayout from './components/teacher/layout/TeacherLayout.jsx'
import TeacherDashboard from './components/teacher/dashboard/TeacherDashboard.jsx'
import TeacherCalendar from './components/teacher/pages/TeacherCalendar.jsx'
import TeacherAttendance from './components/teacher/pages/TeacherAttendance.jsx'
import TeacherProfile from './components/teacher/pages/TeacherProfile.jsx'
import CourseDetailPlaceholder from './components/teacher/pages/CourseDetailPlaceholder.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortalLanding />} />

      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="calendar" element={<TeacherCalendar />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="course/:courseId" element={<CourseDetailPlaceholder />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
