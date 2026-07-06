import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope, faIdBadge, faEarthAmericas, faCity, faSchool, faKey,
  faRightFromBracket, faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import SubAdminTopbar from '../Layout/SubAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import WaitingPopup from '../../../Media/WaitingPopup.jsx'
import ChangePasswordPopup from '../Popups/ChangePasswordPopup.jsx'
import { adminInfo, permissions } from '../data/subAdminData.js'

function Profile() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="subadmin-page profile-page-bg">
      <SubAdminTopbar breadcrumb={['Home', 'Profile']} />

      <div className="subadmin-profile-card">
        <div className="subadmin-profile-top">
          <Avatar name={adminInfo.name} photoUrl={adminInfo.photo} className="subadmin-profile-avatar" />
          <div>
            <h2 className="subadmin-profile-name">{adminInfo.name}</h2>
            <span className="subadmin-profile-role-badge">{adminInfo.role}</span>
          </div>
          <button type="button" className="profile-logout-btn subadmin-profile-logout" onClick={() => setShowLogout(true)}>
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        </div>

        <div className="subadmin-profile-info-row">
          <p><FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> {adminInfo.email}</p>
          <p><FontAwesomeIcon icon={faEarthAmericas} /> <strong>Country:</strong> {adminInfo.country}</p>
          <p><FontAwesomeIcon icon={faCity} /> <strong>City:</strong> {adminInfo.city}</p>
          <p><FontAwesomeIcon icon={faSchool} /> <strong>Campus:</strong> {adminInfo.campus}</p>
        </div>

        <button type="button" className="teacher-update-password-btn subadmin-change-password-btn" onClick={() => setShowPassword(true)}>
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
