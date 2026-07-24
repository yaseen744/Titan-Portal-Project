import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import TeacherSidebar from './TeacherSidebar.jsx'
import WaitingPopup from '../../Media/WaitingPopup.jsx'
import { isTeacherLoggedIn, clearTeacherSession } from '../../../api/session.js'

function TeacherShell() {
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  useEffect(() => {
    if (!isTeacherLoggedIn()) navigate('/')
  }, [navigate])

  return (
    <div className="teacher-shell">
      <TeacherSidebar onLogoutClick={() => setShowLogout(true)} />

      <main className="teacher-shell-main">
        <Outlet />
      </main>

      <WaitingPopup
        show={showLogout}
        label="Logging out..."
        durationMs={5000}
        onComplete={() => {
          clearTeacherSession()
          navigate('/')
        }}
      />
    </div>
  )
}

export default TeacherShell
