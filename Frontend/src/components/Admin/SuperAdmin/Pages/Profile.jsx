import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope, faIdBadge, faEarthAmericas, faCity, faSchool, faKey,
  faRightFromBracket, faShieldHalved, faCrown,
} from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import WaitingPopup from '../../../Media/WaitingPopup.jsx'
import ChangePasswordPopup from '../Popups/ChangePasswordPopup.jsx'
import { adminInfo, permissions } from '../data/superAdminData.js'

function Profile() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="superadmin-page profile-page-bg">
      <SuperAdminTopbar breadcrumb={['Home', 'Profile']} />

      <div className="superadmin-profile-card">
        <div className="superadmin-profile-top">
          <Avatar name={adminInfo.name} photoUrl={adminInfo.photo} className="superadmin-profile-avatar" />
          <div>
            <h2 className="superadmin-profile-name">{adminInfo.name}</h2>
            <span className="superadmin-profile-role-badge">
              <FontAwesomeIcon icon={faCrown} /> {adminInfo.role}
            </span>
          </div>
          <button type="button" className="profile-logout-btn superadmin-profile-logout" onClick={() => setShowLogout(true)}>
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        </div>

        <div className="superadmin-profile-info-row">
          <p><FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> {adminInfo.email}</p>
          <p><FontAwesomeIcon icon={faEarthAmericas} /> <strong>Country:</strong> {adminInfo.country}</p>
          <p><FontAwesomeIcon icon={faCity} /> <strong>City:</strong> {adminInfo.city}</p>
          <p><FontAwesomeIcon icon={faSchool} /> <strong>Campus:</strong> {adminInfo.campus}</p>
        </div>

        <button type="button" className="teacher-update-password-btn superadmin-change-password-btn" onClick={() => setShowPassword(true)}>
          <FontAwesomeIcon icon={faKey} /> Change Password
        </button>

        <h4 className="student-form-section-heading">
          <FontAwesomeIcon icon={faShieldHalved} /> Permissions
        </h4>

        <div className="permissions-list">
          {permissions.map((p) => (
            <div key={p.key} className="permission-row">
              <span className="permission-key">
                <FontAwesomeIcon icon={faIdBadge} /> {p.key}
              </span>
              <span className="permission-badges">
                {p.actions.map((a) => (
                  <span key={a} className="permission-badge">{a}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ChangePasswordPopup show={showPassword} onClose={() => setShowPassword(false)} />

      <WaitingPopup
        show={showLogout}
        label="Logging out..."
        durationMs={5000}
        onComplete={() => navigate('/')}
      />
    </div>
  )
}

export default Profile
