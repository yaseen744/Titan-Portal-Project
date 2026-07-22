import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserPen } from '@fortawesome/free-solid-svg-icons'

function TeacherEditProfilePopup({ show, info, onClose, onSave }) {
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
          <label className="auth-input-label">Social Link</label>
          <div className="auth-input-wrap">
            <input
              className="auth-input"
              placeholder="https://linkedin.com/in/your-profile"
              value={form.socialLinks?.[0] || ''}
              onChange={(e) => setForm({ ...form, socialLinks: [e.target.value] })}
            />
          </div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Bio</label>
          <textarea
            className="feedback-textarea"
            rows={3}
            value={form.bio}
            onChange={handleChange('bio')}
            placeholder="Tell students a little about yourself"
          ></textarea>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>Back</button>
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

export default TeacherEditProfilePopup
