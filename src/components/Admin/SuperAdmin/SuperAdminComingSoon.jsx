import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

// Super Admin is intentionally left for later - this is just a placeholder
// so the route exists and looks intentional rather than broken.
function SuperAdminComingSoon() {
  const navigate = useNavigate()

  return (
    <div className="portal-placeholder">
      <FontAwesomeIcon icon={faUserShield} className="portal-placeholder-icon" />
      <h2 className="portal-placeholder-heading">Super Admin</h2>
      <p className="portal-placeholder-text">
        This panel is coming soon. Super Admin will manage everything across all campuses,
        including creating and assigning Sub Admin permissions.
      </p>
      <button type="button" className="auth-btn-secondary" onClick={() => navigate('/')} style={{ marginTop: 18, maxWidth: 220 }}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
      </button>
    </div>
  )
}

export default SuperAdminComingSoon
