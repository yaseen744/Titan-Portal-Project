import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserPen } from '@fortawesome/free-solid-svg-icons'

function EditProfilePopup({ show, info, onClose, onSave }) {
  const [form, setForm] = useState(info)

  if (!show) return null

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="generic-popup-overlay">
      <div className="edit-profile-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faUserPen} /> Edit Profile
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="edit-profile-grid">
          <div className="auth-input-group">
            <label className="auth-input-label">Name</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.name} onChange={handleChange('name')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Number</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.phone} onChange={handleChange('phone')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Email</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.email} onChange={handleChange('email')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Gender</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.gender} onChange={handleChange('gender')}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">CNIC</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.cnic} onChange={handleChange('cnic')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Date of Birth</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.dob} onChange={handleChange('dob')} />
            </div>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Address</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.address} onChange={handleChange('address')} />
            </div>
          </div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>
            Back
          </button>
          <button
            className="generic-popup-btn"
            onClick={() => {
              onSave(form)
              onClose()
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePopup
