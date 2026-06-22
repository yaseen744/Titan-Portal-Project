import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import TitanLogoMark from '../../common/Auth/TitanLogoMark.jsx'
import TeacherAvatarPlaceholder from '../images/TeacherAvatarPlaceholder.jsx'
import LogoutPopup from '../popups/LogoutPopup.jsx'
import './TeacherSidebar.css'

const navItems = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: 'fa-solid fa-table-columns' },
  { to: '/teacher/calendar', label: 'Calendar', icon: 'fa-solid fa-calendar-days' },
  { to: '/teacher/attendance', label: 'Attendance', icon: 'fa-solid fa-clipboard-check' },
]

function TeacherSidebar({ isCollapsed, onToggleCollapse }) {
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)

  function handleProfileClick() {
    setShowProfileMenu(false)
    navigate('/teacher/profile')
  }

  function handleLogoutClick() {
    setShowProfileMenu(false)
    setShowLogoutPopup(true)
  }

  function handleLogoutFinish() {
    setShowLogoutPopup(false)
    navigate('/')
  }

  return (
    <div className={isCollapsed ? 'teacherSidebar teacherSidebarCollapsed' : 'teacherSidebar'}>
      <button
        type="button"
        className="teacherSidebarFoldBtn"
        onClick={onToggleCollapse}
        aria-label="Toggle sidebar"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="teacherSidebarLogoArea">
        <TitanLogoMark size={isCollapsed ? 30 : 44} variant="icon" />
        {!isCollapsed && <span className="teacherSidebarLogoText">Titan Portal</span>}
      </div>

      <nav className="teacherSidebarNav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'teacherSidebarNavItem teacherSidebarNavItemActive' : 'teacherSidebarNavItem'
            }
          >
            <i className={item.icon}></i>
            {!isCollapsed && <span className="teacherSidebarNavLabel">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="teacherSidebarProfileArea">
        <button
          type="button"
          className="teacherSidebarProfileBtn"
          onClick={() => setShowProfileMenu((v) => !v)}
        >
          <TeacherAvatarPlaceholder size={isCollapsed ? 32 : 38} />
          {!isCollapsed && <span className="teacherSidebarProfileName">Sir Yasir Ali (SUK)</span>}
        </button>

        {showProfileMenu && (
          <div className="teacherSidebarProfileMenu">
            <button type="button" className="teacherSidebarProfileMenuItem" onClick={handleProfileClick}>
              <i className="fa-solid fa-id-badge"></i>
              <span>Profile</span>
            </button>
            <button type="button" className="teacherSidebarProfileMenuItem" onClick={handleLogoutClick}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {showLogoutPopup && <LogoutPopup onFinish={handleLogoutFinish} />}
    </div>
  )
}

export default TeacherSidebar
