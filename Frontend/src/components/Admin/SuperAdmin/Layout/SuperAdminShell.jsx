import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import SuperAdminSidebar from './SuperAdminSidebar.jsx'
import WaitingPopup from '../../../Media/WaitingPopup.jsx'

function SuperAdminShell() {
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="superadmin-shell">
      <SuperAdminSidebar onLogoutClick={() => setShowLogout(true)} />

      <main className="superadmin-shell-main">
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

export default SuperAdminShell
