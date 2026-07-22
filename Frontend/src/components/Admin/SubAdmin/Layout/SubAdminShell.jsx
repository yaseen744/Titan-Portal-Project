import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import SubAdminSidebar from './SubAdminSidebar.jsx'
import WaitingPopup from '../../../Media/WaitingPopup.jsx'

function SubAdminShell() {
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="subadmin-shell">
      <SubAdminSidebar onLogoutClick={() => setShowLogout(true)} />

      <main className="subadmin-shell-main">
        <Outlet />
      </main>

      <WaitingPopup
        show={showLogout}
        label="Logging out..."
        durationMs={5000}
        onComplete={() => navigate('/')}
      />
    </div>
  )
}

export default SubAdminShell
