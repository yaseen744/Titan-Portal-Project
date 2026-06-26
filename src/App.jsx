import { Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing.jsx'
import StudentPortal from './components/Student/Layout/StudentPortal.jsx'
import TeacherPortal from './components/Teacher/Layout/TeacherPortal.jsx'

function App() {
  return (
    <Routes>
      {/* Shared entry gateway - login / create account for both roles */}
      <Route path="/" element={<Landing />} />

      {/* Everything under /student/* lives inside the Student folder only */}
      <Route path="/student/*" element={<StudentPortal />} />

      {/* Everything under /teacher/* lives inside the Teacher folder only */}
      <Route path="/teacher/*" element={<TeacherPortal />} />
    </Routes>
  )
}

export default App
