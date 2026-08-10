import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faTriangleExclamation, faChalkboardUser } from '@fortawesome/free-solid-svg-icons'
import { genders } from '../../../shared/permissionsConfig.js'
import { api } from '../../../../../api/client.js'

const emptyReplacement = { name: '', email: '', phone: '', gender: '', password: '', hourlyRate: '' }

// A trainer can't just be deleted mid-course - their batches need someone
// new immediately, so this always collects a replacement in the same step.
// The backend reassigns every Slot the outgoing trainer teaches to the new
// one atomically.
function DeleteTrainerPopup({ trainer, onClose, onDeleted }) {
  const [replacement, setReplacement] = useState(emptyReplacement)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!trainer) return null

  const set = (field) => (e) => setReplacement({ ...replacement, [field]: e.target.value })

  const handleClose = () => {
    setReplacement(emptyReplacement)
    setError('')
    onClose()
  }

  const handleConfirm = async () => {
    setError('')
    if (!replacement.name.trim() || !replacement.email.trim() || !replacement.phone.trim() || !replacement.password) {
      setError('The replacement trainer needs a name, email, phone and password.')
      return
    }
    setLoading(true)
    try {
      const res = await api.delete(`/teachers/${trainer._id}`, { replacement })
      onDeleted?.(res.message)
      handleClose()
    } catch (err) {
      setError(err.message || 'Could not remove this trainer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="generic-popup-overlay">
      <div className="assignment-submit-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faTriangleExclamation} /> Remove {trainer.name}?
          </span>
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <p className="generic-popup-text" style={{ textAlign: 'left' }}>
          All of {trainer.name}'s current batches need a trainer. Enter a replacement below —
          every batch they teach will move to the new trainer immediately.
        </p>

        {error && <div className="auth-error-banner">{error}</div>}

        <h4 className="student-form-section-heading">
          <FontAwesomeIcon icon={faChalkboardUser} /> Replacement Trainer
        </h4>

        <div className="edit-profile-grid">
          <div className="auth-input-group">
            <label className="auth-input-label">Full Name</label>
            <div className="auth-input-wrap"><input className="auth-input" value={replacement.name} onChange={set('name')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Email</label>
            <div className="auth-input-wrap"><input type="email" className="auth-input" value={replacement.email} onChange={set('email')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Phone</label>
            <div className="auth-input-wrap"><input className="auth-input" value={replacement.phone} onChange={set('phone')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Gender</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={replacement.gender} onChange={set('gender')}>
                <option value="">Select</option>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Temporary Password</label>
            <div className="auth-input-wrap"><input type="password" className="auth-input" value={replacement.password} onChange={set('password')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Hourly Rate (Rs.)</label>
            <div className="auth-input-wrap"><input type="number" min="0" className="auth-input" value={replacement.hourlyRate} onChange={set('hourlyRate')} /></div>
          </div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={handleClose}>Cancel</button>
          <button className="generic-popup-btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Removing...' : 'Remove & Replace'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTrainerPopup
