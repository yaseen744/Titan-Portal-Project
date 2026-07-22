import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import StudentSidebar from './StudentSidebar.jsx'
import FeedbackPopup from '../Popups/FeedbackPopup.jsx'
import WaitingPopup from '../../Media/WaitingPopup.jsx'
import { isLoggedIn, clearSession } from '../../../api/session.js'

function StudentShell() {
  const navigate = useNavigate()
  const [showFeedback, setShowFeedback] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  // If someone opens a /student/* URL directly without being logged in,
  // send them back to the landing page instead of showing a broken portal.
  useEffect(() => {
    if (!isLoggedIn()) navigate('/')
  }, [navigate])

  return (
    <div className="student-shell">
      <StudentSidebar onLogoutClick={() => setShowLogout(true)} />

      <main className="student-shell-main">
        <Outlet context={{ openFeedback: () => setShowFeedback(true) }} />
      </main>

      <FeedbackPopup show={showFeedback} onClose={() => setShowFeedback(false)} />

      <WaitingPopup
        show={showLogout}
        label="Logging out..."
        durationMs={5000}
        onComplete={() => {
          clearSession()
          navigate('/')
        }}
      />
    </div>
  )
}

export default StudentShell
