import './ForgotPasswordPopup.css'

function ForgotPasswordPopup({ onClose }) {
  return (
    <div className="forgotPasswordOverlay">
      <div className="forgotPasswordCard">
        <button
          type="button"
          className="forgotPasswordCloseBtn"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="forgotPasswordIcon">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h3 className="forgotPasswordHeading">Reset Password</h3>
        <p className="forgotPasswordText">
          Password reset isn't available yet. Once this portal is connected
          to the server, you'll be able to reset your password right from
          here. For now, please reach out to your campus admin.
        </p>
        <button type="button" className="forgotPasswordOkBtn" onClick={onClose}>
          Okay, got it
        </button>
      </div>
    </div>
  )
}

export default ForgotPasswordPopup
