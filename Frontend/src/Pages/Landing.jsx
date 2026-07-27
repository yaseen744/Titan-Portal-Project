import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRightToBracket, faUserPlus, faUserTie, faUserShield, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

import titanLogo from '../components/Media/images/titan-logo.png'
import WaitingPopup from '../components/Media/WaitingPopup.jsx'
import ForgotPasswordPopup from '../components/Media/ForgotPasswordPopup.jsx'

import StudentLoginForm from '../components/Student/Auth/StudentLoginForm.jsx'
import StudentCreateForm from '../components/Student/Auth/StudentCreateForm.jsx'
import TeacherLoginForm from '../components/Teacher/Auth/TeacherLoginForm.jsx'
import SubAdminLoginForm from '../components/Admin/SubAdmin/Auth/SubAdminLoginForm.jsx'
import SuperAdminLoginForm from '../components/Admin/SuperAdmin/Auth/SuperAdminLoginForm.jsx'

function Landing() {
  const navigate = useNavigate()

  // 'student' | 'teacher' | 'admin'
  const [role, setRole] = useState('student')
  // 'login' or 'create' - only relevant while role === 'student'
  const [mode, setMode] = useState('login')
  // 'subadmin' | 'superadmin' | null (role picker shown when null)
  const [adminType, setAdminType] = useState(null)

  const [showWaiting, setShowWaiting] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const portalHeading =
    role === 'teacher' ? 'Trainer Portal' :
    role === 'admin' ? 'Admin Panel' :
    'Student Portal'

  // Called once any form is validly submitted - shows the waiting popup,
  // and once the progress bar finishes, routes into the right portal.
  const handleFormSubmit = () => {
    setShowWaiting(true)
  }

  const handleWaitingComplete = () => {
    setShowWaiting(false)
    if (role === 'teacher') {
      navigate('/teacher/dashboard')
    } else if (role === 'admin' && adminType === 'subadmin') {
      navigate('/admin/subadmin/dashboard')
    } else if (role === 'admin' && adminType === 'superadmin') {
      navigate('/admin/superadmin/dashboard')
    } else {
      navigate('/student/landing')
    }
  }

  const switchToTeacher = () => {
    setRole('teacher')
    setMode('login')
  }

  const switchToStudent = () => {
    setRole('student')
    setMode('login')
    setAdminType(null)
  }

  const switchToAdmin = () => {
    setRole('admin')
    setAdminType(null)
  }

  return (
    <div className="landing-page">
      <div className="landing-glow landing-glow-one"></div>
      <div className="landing-glow landing-glow-two"></div>

      <div className="landing-content">
        <img src={titanLogo} alt="Titan Institute logo" className="landing-logo" />

        <h1 key={portalHeading} className="landing-heading">
          {portalHeading}
        </h1>

        {role === 'student' && (
          <div className="landing-toggle-group">
            <button
              type="button"
              className={`landing-toggle-btn ${mode === 'login' ? 'landing-toggle-btn-active' : ''}`}
              onClick={() => setMode('login')}
            >
              <FontAwesomeIcon icon={faRightToBracket} /> Login
            </button>
            <button
              type="button"
              className={`landing-toggle-btn ${mode === 'create' ? 'landing-toggle-btn-active' : ''}`}
              onClick={() => setMode('create')}
            >
              <FontAwesomeIcon icon={faUserPlus} /> Create
            </button>
          </div>
        )}

        <div className="auth-card">
          {role === 'student' && mode === 'login' && (
            <StudentLoginForm
              onSubmit={handleFormSubmit}
              onSwitchToTeacher={switchToTeacher}
              onSwitchToAdmin={switchToAdmin}
            />
          )}

          {role === 'student' && mode === 'create' && (
            <StudentCreateForm onSubmit={handleFormSubmit} />
          )}

          {role === 'teacher' && (
            <TeacherLoginForm
              onSubmit={handleFormSubmit}
              onSwitchToStudent={switchToStudent}
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          )}

          {role === 'admin' && adminType === null && (
            <div className="auth-form">
              <h3 className="auth-form-heading">Choose Admin Type</h3>
              <p className="auth-form-subtext">
                Select which kind of admin account you'd like to log in with.
              </p>

              <button type="button" className="admin-type-card" onClick={() => setAdminType('subadmin')}>
                <FontAwesomeIcon icon={faUserTie} className="admin-type-icon" />
                <span className="admin-type-text">
                  <span className="admin-type-title">Sub Admin</span>
                  <span className="admin-type-desc">Campus staff — students, attendance, trainers &amp; more</span>
                </span>
              </button>

              <button type="button" className="admin-type-card" onClick={() => setAdminType('superadmin')}>
                <FontAwesomeIcon icon={faUserShield} className="admin-type-icon" />
                <span className="admin-type-text">
                  <span className="admin-type-title">Super Admin</span>
                  <span className="admin-type-desc">Full control across every city &amp; campus</span>
                </span>
              </button>

              <button type="button" className="auth-link-btn" onClick={switchToStudent}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Student Login
              </button>
            </div>
          )}

          {role === 'admin' && adminType === 'subadmin' && (
            <>
              <SubAdminLoginForm
                onSubmit={handleFormSubmit}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
              <button type="button" className="auth-link-btn" onClick={() => setAdminType(null)}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
            </>
          )}

          {role === 'admin' && adminType === 'superadmin' && (
            <>
              <SuperAdminLoginForm
                onSubmit={handleFormSubmit}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
              <button type="button" className="auth-link-btn" onClick={() => setAdminType(null)}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
            </>
          )}
        </div>
      </div>

      <WaitingPopup
        show={showWaiting}
        label={role === 'student' && mode === 'login' ? 'Waiting...' : 'Logging you in...'}
        durationMs={5000}
        onComplete={handleWaitingComplete}
      />

      <ForgotPasswordPopup show={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </div>
  )
}

export default Landing
