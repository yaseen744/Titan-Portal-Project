import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TitanLogoMark from './TitanLogoMark.jsx'
import LoadingPopup from './LoadingPopup.jsx'
import ForgotPasswordPopup from './ForgotPasswordPopup.jsx'
import './PortalLanding.css'

// view can be: 'student-login' | 'student-create' | 'teacher-login'
function PortalLanding() {
  const navigate = useNavigate()

  const [view, setView] = useState('student-login')
  const [showStudentPassword, setShowStudentPassword] = useState(false)
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [showTeacherPassword, setShowTeacherPassword] = useState(false)
  const [showLoadingPopup, setShowLoadingPopup] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showStudentComingSoon, setShowStudentComingSoon] = useState(false)
  const [pendingRole, setPendingRole] = useState(null)

  const headingText = view === 'teacher-login' ? 'Trainer Portal' : 'Student Portal'

  function handleStudentLoginSubmit(e) {
    e.preventDefault()
    setPendingRole('student')
    setShowLoadingPopup(true)
  }

  function handleStudentCreateSubmit(e) {
    e.preventDefault()
    setPendingRole('student')
    setShowLoadingPopup(true)
  }

  function handleTeacherLoginSubmit(e) {
    e.preventDefault()
    setPendingRole('teacher')
    setShowLoadingPopup(true)
  }

  function handleLoadingFinish() {
    setShowLoadingPopup(false)
    if (pendingRole === 'teacher') {
      navigate('/teacher/dashboard')
    } else {
      setShowStudentComingSoon(true)
    }
    setPendingRole(null)
  }

  return (
    <div className="portalLandingWrapper">
      <div className="portalLandingLogo">
        <TitanLogoMark size={150} variant="full" />
      </div>

      <h1 key={headingText} className="portalLandingHeading">
        {headingText}
      </h1>

      {view !== 'teacher-login' && (
        <div className="portalLandingToggleGroup">
          <button
            type="button"
            className={
              view === 'student-login'
                ? 'portalLandingToggleBtn portalLandingToggleBtnActive'
                : 'portalLandingToggleBtn'
            }
            onClick={() => setView('student-login')}
          >
            Login
          </button>
          <button
            type="button"
            className={
              view === 'student-create'
                ? 'portalLandingToggleBtn portalLandingToggleBtnActive'
                : 'portalLandingToggleBtn'
            }
            onClick={() => setView('student-create')}
          >
            Create
          </button>
        </div>
      )}

      <div className="portalLandingCard">
        {view === 'student-login' && (
          <form onSubmit={handleStudentLoginSubmit}>
            <h2 className="portalLandingCardHeading">Login</h2>
            <p className="portalLandingCardSubtext">
              kindly provide the CNIC number and password used during SMIT
              course registration.
            </p>

            <div className="portalLandingFormGroup">
              <label className="portalLandingLabel" htmlFor="studentCnic">
                CNIC *
              </label>
              <input
                id="studentCnic"
                type="text"
                required
                placeholder="42101-1234567-1"
                className="portalLandingInput"
              />
            </div>

            <div className="portalLandingFormGroup">
              <label className="portalLandingLabel" htmlFor="studentPassword">
                Password *
              </label>
              <div className="portalLandingInputWrapper">
                <input
                  id="studentPassword"
                  type={showStudentPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  className="portalLandingInput"
                />
                <button
                  type="button"
                  className="portalLandingEyeBtn"
                  onClick={() => setShowStudentPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  <i className={showStudentPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="portalLandingPrimaryBtn">
              Login
            </button>
            <button
              type="button"
              className="portalLandingSecondaryBtn"
              onClick={() => setView('teacher-login')}
            >
              Login as Teacher
            </button>
          </form>
        )}

        {view === 'student-create' && (
          <form onSubmit={handleStudentCreateSubmit}>
            <h2 className="portalLandingCardHeading">Create a password</h2>
            <p className="portalLandingCardSubtext">
              kindly provide the CNIC number and password used during SMIT
              course registration.
            </p>

            <div className="portalLandingFormGroup">
              <label className="portalLandingLabel" htmlFor="createCnic">
                CNIC *
              </label>
              <input
                id="createCnic"
                type="text"
                required
                placeholder="42101-1234567-1"
                className="portalLandingInput"
              />
            </div>

            <div className="portalLandingFormGroup">
              <label className="portalLandingLabel" htmlFor="createDob">
                Date of Birth *
              </label>
              <input id="createDob" type="date" required className="portalLandingInput" />
            </div>

            <div className="portalLandingFormGroup">
              <label className="portalLandingLabel" htmlFor="createPassword">
                Password *
              </label>
              <div className="portalLandingInputWrapper">
                <input
                  id="createPassword"
                  type={showCreatePassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password"
                  className="portalLandingInput"
                />
                <button
                  type="button"
                  className="portalLandingEyeBtn"
                  onClick={() => setShowCreatePassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  <i className={showCreatePassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="portalLandingPrimaryBtn">
              Submit
            </button>
          </form>
        )}

        {view === 'teacher-login' && (
          <form onSubmit={handleTeacherLoginSubmit}>
            <h2 className="portalLandingCardHeading">Login</h2>
            <p className="portalLandingCardSubtext">
              kindly provide the CNIC number and password used during SMIT
              course registration.
            </p>

            <div className="portalLandingFormGroup">
              <label className="portalLandingLabel" htmlFor="teacherEmail">
                Email *
              </label>
              <input
                id="teacherEmail"
                type="email"
                required
                placeholder="you@example.com"
                className="portalLandingInput"
              />
            </div>

            <div className="portalLandingFormGroup">
              <label className="portalLandingLabel" htmlFor="teacherPassword">
                Password *
              </label>
              <div className="portalLandingInputWrapper">
                <input
                  id="teacherPassword"
                  type={showTeacherPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  className="portalLandingInput"
                />
                <button
                  type="button"
                  className="portalLandingEyeBtn"
                  onClick={() => setShowTeacherPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  <i className={showTeacherPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="portalLandingPrimaryBtn">
              Login
            </button>

            <button
              type="button"
              className="portalLandingForgotLink"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot password?
            </button>

            <button
              type="button"
              className="portalLandingSecondaryBtn"
              onClick={() => setView('student-login')}
            >
              Login as Student
            </button>
          </form>
        )}
      </div>

      {showLoadingPopup && <LoadingPopup onFinish={handleLoadingFinish} />}
      {showForgotPassword && (
        <ForgotPasswordPopup onClose={() => setShowForgotPassword(false)} />
      )}
      {showStudentComingSoon && (
        <div className="portalLandingComingSoonOverlay">
          <div className="portalLandingComingSoonCard">
            <button
              type="button"
              className="portalLandingComingSoonCloseBtn"
              onClick={() => setShowStudentComingSoon(false)}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="portalLandingComingSoonIcon">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <h3 className="portalLandingComingSoonHeading">Almost there!</h3>
            <p className="portalLandingComingSoonText">
              The student dashboard is being built in the next phase. The
              teacher portal is ready to explore right now.
            </p>
            <button
              type="button"
              className="portalLandingComingSoonOkBtn"
              onClick={() => setShowStudentComingSoon(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortalLanding
