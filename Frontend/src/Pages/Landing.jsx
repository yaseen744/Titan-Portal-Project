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
import api from '../api/axios.js'
import { saveSession, saveTeacherSession } from '../api/session.js'

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
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const portalHeading =
    role === 'teacher' ? 'Trainer Portal' :
    role === 'admin' ? 'Admin Panel' :
    'Student Portal'

  // Called once the Student Login form is validly filled in.
  // Hits the real backend, saves the session, then shows the waiting popup.
  const handleStudentLogin = async ({ cnic, password }) => {
    setAuthError('')
    setAuthLoading(true)
    try {
      const { data } = await api.post('/student/login', { cnic, password })
      saveSession(data.token, data.student)
      setShowWaiting(true)
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Called once the Student Create Account form is validly filled in.
  const handleStudentCreateAccount = async ({ cnic, dob, password }) => {
    setAuthError('')
    setAuthLoading(true)
    try {
      const { data } = await api.post('/student/create-account', { cnic, dob, password })
      saveSession(data.token, data.student)
      setShowWaiting(true)
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Could not create account. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Teacher/SubAdmin/SuperAdmin backends don't exist yet, so their forms
  // keep the original mock behaviour (just shows the waiting popup).
  const handleFormSubmit = () => {
    setShowWaiting(true)
  }

  // Called once the Teacher Login form is validly filled in. Hits the real backend.
  const handleTeacherLogin = async ({ email, password }) => {
    setAuthError('')
    setAuthLoading(true)
    try {
      const { data } = await api.post('/teacher/login', { email, password })
      saveTeacherSession(data.token, data.teacher)
      setShowWaiting(true)
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
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
              onSubmit={handleStudentLogin}
              onSwitchToTeacher={switchToTeacher}
              onSwitchToAdmin={switchToAdmin}
              apiError={authError}
              loading={authLoading}
            />
          )}

          {role === 'student' && mode === 'create' && (
            <StudentCreateForm
              onSubmit={handleStudentCreateAccount}
              apiError={authError}
              loading={authLoading}
            />
          )}

          {role === 'teacher' && (
            <TeacherLoginForm
              onSubmit={handleTeacherLogin}
              onSwitchToStudent={switchToStudent}
              apiError={authError}
              loading={authLoading}
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
