import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faXmark } from '@fortawesome/free-solid-svg-icons'

function ForgotPasswordPopup({ show, onClose }) {
  if (!show) return null

  return (
    <div className="generic-popup-overlay">
      <div className="generic-popup-card">
        <button className="generic-popup-close" onClick={onClose} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="generic-popup-icon-wrap">
          <FontAwesomeIcon icon={faKey} className="generic-popup-icon" />
        </div>
        <h3 className="generic-popup-title">Password Recovery</h3>
        <p className="generic-popup-text">
          Password resets aren't available through the portal yet. Please reach out to your
          campus coordinator at Titan, and they'll help you regain access to your account.
        </p>
        <button className="generic-popup-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  )
}

export default ForgotPasswordPopup
