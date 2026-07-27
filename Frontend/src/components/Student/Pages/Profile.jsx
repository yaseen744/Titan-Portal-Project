import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserPen, faEnvelope, faPhone, faLocationDot, faIdCard,
  faVenusMars, faCakeCandles, faGraduationCap, faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import StudentTopbar from '../Layout/StudentTopbar.jsx'
import EditProfilePopup from '../Popups/EditProfilePopup.jsx'
import WaitingPopup from '../../Media/WaitingPopup.jsx'
import Avatar from '../../Media/Avatar.jsx'
import titanLogo from '../../Media/images/titan-logo.png'
import { studentInfo as initialInfo } from '../data/studentData.js'

function Profile() {
  const navigate = useNavigate()
  const { openFeedback } = useOutletContext()
  const [info, setInfo] = useState(initialInfo)
  const [showEdit, setShowEdit] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="student-page profile-page-bg">
      <StudentTopbar breadcrumb={['Home', 'WMA', 'Profile']} onFeedbackClick={openFeedback} />

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
        </div>
      </div>
      <h3 className="profile-name">{info.name}</h3>

      <div className="profile-info-row">
        <div className="profile-info-card">
          <h5 className="profile-info-heading">
            <FontAwesomeIcon icon={faEnvelope} /> Contact Info
          </h5>
          <p className="profile-info-line"><FontAwesomeIcon icon={faEnvelope} /> Email: {info.email}</p>
          <p className="profile-info-line"><FontAwesomeIcon icon={faPhone} /> Number: {info.phone}</p>
          <p className="profile-info-line"><FontAwesomeIcon icon={faLocationDot} /> Address: {info.address}</p>
        </div>

        <div className="profile-info-card">
          <h5 className="profile-info-heading">
            <FontAwesomeIcon icon={faIdCard} /> Personal Info
          </h5>
          <p className="profile-info-line"><FontAwesomeIcon icon={faVenusMars} /> Gender: {info.gender}</p>
          <p className="profile-info-line"><FontAwesomeIcon icon={faCakeCandles} /> Date of Birth: {info.dob}</p>
          <p className="profile-info-line"><FontAwesomeIcon icon={faIdCard} /> CNIC: {info.cnic}</p>
          <p className="profile-info-line"><FontAwesomeIcon icon={faGraduationCap} /> Last Qualification: {info.qualification}</p>
        </div>

        <div className="profile-info-card">
          <h5 className="profile-info-heading">
            <FontAwesomeIcon icon={faGraduationCap} /> Enrolled Course
          </h5>
          <p className="profile-course-name">{info.course}</p>
          <span className="profile-enrolled-badge">Enrolled</span>
        </div>
      </div>

      <div className="profile-logout-row">
        <button type="button" className="profile-logout-btn" onClick={() => setShowLogout(true)}>
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </button>
      </div>

      <EditProfilePopup
        show={showEdit}
        info={info}
        onClose={() => setShowEdit(false)}
        onSave={(newInfo) => setInfo(newInfo)}
      />

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
