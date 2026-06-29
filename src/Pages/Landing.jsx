import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import titanLogo from '../components/Media/images/titan-logo.png'
import WaitingPopup from '../components/Media/WaitingPopup.jsx'
import ForgotPasswordPopup from '../components/Media/ForgotPasswordPopup.jsx'

import StudentLoginForm from '../components/Student/Auth/StudentLoginForm.jsx'
import StudentCreateForm from '../components/Student/Auth/StudentCreateForm.jsx'
import TeacherLoginForm from '../components/Teacher/Auth/TeacherLoginForm.jsx'

function Landing() {
  const navigate = useNavigate()

  // 'student' or 'teacher'
  const [role, setRole] = useState('student')
  // 'login' or 'create' - only relevant while role === 'student'
  const [mode, setMode] = useState('login')

  const [showWaiting, setShowWaiting] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const portalHeading = role === 'teacher' ? 'Trainer Portal' : 'Student Portal'

  // Called once any form is validly submitted - shows the waiting popup,
  // and once the progress bar finishes, routes into the right portal.
  const handleFormSubmit = () => {
    setShowWaiting(true)
  }

  const handleWaitingComplete = () => {
    setShowWaiting(false)
    if (role === 'teacher') {
      navigate('/teacher/dashboard')
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
            <StudentLoginForm onSubmit={handleFormSubmit} onSwitchToTeacher={switchToTeacher} />
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
        </div>
      </div>

      <WaitingPopup
        show={showWaiting}
        label={role === 'teacher' ? 'Logging you in...' : 'Waiting...'}
        durationMs={5000}
        onComplete={handleWaitingComplete}
      />

      <ForgotPasswordPopup show={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </div>
  )
}

export default Landing
