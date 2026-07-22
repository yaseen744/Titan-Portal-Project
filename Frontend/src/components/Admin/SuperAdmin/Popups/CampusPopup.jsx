import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faSchool, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { citiesByCountry } from '../data/superAdminData.js'

const emptyForm = { name: '', city: '', address: '', capacity: '' }

function CampusPopup({ show, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [created, setCreated] = useState(false)

  if (!show) return null

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleClose = () => {
    setForm(emptyForm)
    setCreated(false)
    onClose()
  }

  if (created) {
    return (
      <div className="generic-popup-overlay">
        <div className="generic-popup-card">
          <div className="generic-popup-icon-wrap">
            <FontAwesomeIcon icon={faCircleCheck} className="generic-popup-icon" />
          </div>
          <h3 className="generic-popup-title">Campus Added!</h3>
          <p className="generic-popup-text">
            {form.name || 'The new campus'} has been added to {form.city || 'the selected city'}. (Frontend
            demo — nothing is saved until the backend is connected.)
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
            <FontAwesomeIcon icon={faSchool} /> Add Campus
          </span>
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Campus Name</label>
          <div className="auth-input-wrap"><input className="auth-input" placeholder="SMIT Multan Campus" value={form.name} onChange={set('name')} /></div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">City</label>
          <div className="auth-input-wrap">
            <select className="auth-input" value={form.city} onChange={set('city')}>
              <option value="">Select or type a new city</option>
              {citiesByCountry.Pakistan.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Address</label>
          <div className="auth-input-wrap"><input className="auth-input" value={form.address} onChange={set('address')} /></div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Capacity (students)</label>
          <div className="auth-input-wrap"><input type="number" className="auth-input" value={form.capacity} onChange={set('capacity')} /></div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={handleClose}>Back</button>
          <button className="generic-popup-btn" onClick={() => setCreated(true)}>Add Campus</button>
        </div>
      </div>
    </div>
  )
}

export default CampusPopup
