import { Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing.jsx'
import StudentPortal from './components/Student/Layout/StudentPortal.jsx'
import TeacherPortal from './components/Teacher/Layout/TeacherPortal.jsx'
import SubAdminPortal from './components/Admin/SubAdmin/Layout/SubAdminPortal.jsx'
import SuperAdminPortal from './components/Admin/SuperAdmin/Layout/SuperAdminPortal.jsx'

function App() {
  return (
    <Routes>
      {/* Shared entry gateway - login / create account for both roles */}
      <Route path="/" element={<Landing />} />

      {/* Everything under /student/* lives inside the Student folder only */}
      <Route path="/student/*" element={<StudentPortal />} />

      {/* Everything under /teacher/* lives inside the Teacher folder only */}
      <Route path="/teacher/*" element={<TeacherPortal />} />

      {/* Everything under /admin/subadmin/* lives inside Admin/SubAdmin only */}
      <Route path="/admin/subadmin/*" element={<SubAdminPortal />} />

      {/* Everything under /admin/superadmin/* lives inside Admin/SuperAdmin only */}
      <Route path="/admin/superadmin/*" element={<SuperAdminPortal />} />
    </Routes>
  )
}

export default App
