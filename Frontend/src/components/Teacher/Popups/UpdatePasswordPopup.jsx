import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faLock, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/axios.js'

function UpdatePasswordPopup({ show, onClose }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!show) return null

  const handleClose = () => {
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setSaved(false)
    setError('')
    onClose()
  }

  const canApply = oldPassword && newPassword && confirmPassword && newPassword === confirmPassword

  const handleApply = async () => {
    setError('')
    setSaving(true)
    try {
      await api.put('/teacher/password', { oldPassword, newPassword })
      setSaved(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="generic-popup-overlay">
        <div className="generic-popup-card">
          <div className="generic-popup-icon-wrap">
            <FontAwesomeIcon icon={faCircleCheck} className="generic-popup-icon" />
          </div>
          <h3 className="generic-popup-title">Password Updated</h3>
          <p className="generic-popup-text">
            Your password has been changed successfully. Use your new password next time you log in.
          </p>
          <button className="generic-popup-btn" onClick={handleClose}>Okay</button>
        </div>
      </div>
    )
  }

  return (
    <div className="generic-popup-overlay">
      <div className="assignment-submit-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faLock} /> Update Password
          </span>
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Old Password</label>
          <div className="auth-input-wrap">
            <input type="password" className="auth-input" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">New Password</label>
          <div className="auth-input-wrap">
            <input type="password" className="auth-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Confirm Password</label>
          <div className="auth-input-wrap">
            <input type="password" className="auth-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>

        {error && <p className="auth-error-text">{error}</p>}

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={handleClose}>Back</button>
          <button className="generic-popup-btn" disabled={!canApply || saving} onClick={handleApply}>
            {saving ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePasswordPopup
