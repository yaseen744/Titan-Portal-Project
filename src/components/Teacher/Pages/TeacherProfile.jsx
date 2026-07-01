import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserPen, faDownload, faIdCard, faIdBadge, faEnvelope, faPhone,
  faMoneyBill, faLink, faShieldHalved, faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import TeacherTopbar from '../Layout/TeacherTopbar.jsx'
import TeacherEditProfilePopup from '../Popups/TeacherEditProfilePopup.jsx'
import UpdatePasswordPopup from '../Popups/UpdatePasswordPopup.jsx'
import WaitingPopup from '../../Media/WaitingPopup.jsx'
import Avatar from '../../Media/Avatar.jsx'
import titanLogo from '../../Media/images/titan-logo.png'
import { teacherInfo as initialInfo } from '../data/teacherData.js'

function TeacherProfile() {
  const navigate = useNavigate()
  const [info, setInfo] = useState(initialInfo)
  const [showEdit, setShowEdit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="teacher-page profile-page-bg">
      <TeacherTopbar breadcrumb={['Home', 'Profile']} />

      <div className="profile-header-wrap">
        <div className="profile-banner">
          <img src={titanLogo} alt="" className="profile-banner-backdrop" />
          <img src={titanLogo} alt="Titan" className="profile-banner-logo" />
        </div>

        <Avatar name={info.name} photoUrl={info.photo} className="profile-photo" />

        <div className="profile-action-btns">
          <button type="button" className="profile-edit-btn" onClick={() => setShowEdit(true)}>
            <FontAwesomeIcon icon={faUserPen} /> Edit Profile
          </button>
          <button type="button" className="profile-edit-btn teacher-download-card-btn">
            <FontAwesomeIcon icon={faDownload} /> Download Card
          </button>
        </div>
      </div>
      <h3 className="profile-name">{info.name}</h3>

      <div className="profile-info-row">
        <div className="profile-info-card">
          <h5 className="profile-info-heading">
            <FontAwesomeIcon icon={faIdCard} /> Contact Info
          </h5>
          <p className="profile-info-line">Bio</p>
          <p className="profile-info-line-dim">{info.bio || 'No bio added yet'}</p>
        </div>

        <div className="profile-info-card">
          <h5 className="profile-info-heading">
            <FontAwesomeIcon icon={faIdBadge} /> Personal Info
          </h5>
          <p className="profile-info-line"><FontAwesomeIcon icon={faEnvelope} /> Email: {info.email}</p>
          <p className="profile-info-line"><FontAwesomeIcon icon={faIdBadge} /> Employee ID: {info.employeeId}</p>
          <p className="profile-info-line"><FontAwesomeIcon icon={faPhone} /> Number: {info.phone}</p>
          <p className="profile-info-line"><FontAwesomeIcon icon={faMoneyBill} /> Hourly Rate: {info.hourlyRate}</p>
        </div>

        <div className="profile-info-card">
          <h5 className="profile-info-heading">
            <FontAwesomeIcon icon={faLink} /> Social Links
          </h5>
          <p className="profile-info-line-dim">
            {info.socialLinks?.length > 0 ? info.socialLinks.join(', ') : 'No Social Links added yet'}
          </p>
        </div>

        <div className="profile-info-card">
          <h5 className="profile-info-heading">
            <FontAwesomeIcon icon={faShieldHalved} /> Security
          </h5>
          <button type="button" className="teacher-update-password-btn" onClick={() => setShowPassword(true)}>
            <FontAwesomeIcon icon={faShieldHalved} /> Update Password
          </button>
        </div>
      </div>

      <div className="profile-logout-row">
        <button type="button" className="profile-logout-btn" onClick={() => setShowLogout(true)}>
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </button>
      </div>

      <TeacherEditProfilePopup
        show={showEdit}
        info={info}
        onClose={() => setShowEdit(false)}
        onSave={(newInfo) => setInfo(newInfo)}
      />

      <UpdatePasswordPopup show={showPassword} onClose={() => setShowPassword(false)} />

      <WaitingPopup
        show={showLogout}
        label="Logging out..."
        durationMs={5000}
        onComplete={() => navigate('/')}
      />
    </div>
  )
}

export default TeacherProfile
