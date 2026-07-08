import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserPen, faImage } from '@fortawesome/free-solid-svg-icons'
import { genders, qualifications, computerLevels } from '../data/subAdminData.js'

function EditStudentPopup({ student, onClose, onSave }) {
  const [form, setForm] = useState({
    name: student.name,
    fatherName: student.fatherName,
    email: student.email,
    phone: student.phone,
    address: student.address,
    gender: student.gender,
    lastQualification: student.lastQualification,
    computerLevel: student.computerLevel,
    photoName: '',
    appPassword: '',
  })

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="generic-popup-overlay">
      <div className="edit-profile-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faUserPen} /> Edit Student
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="edit-profile-grid">
          <div className="auth-input-group">
            <label className="auth-input-label">Name</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.name} onChange={set('name')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Father Name</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.fatherName} onChange={set('fatherName')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Email</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.email} onChange={set('email')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Phone</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.phone} onChange={set('phone')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Gender</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.gender} onChange={set('gender')}>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Last Qualification</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.lastQualification} onChange={set('lastQualification')}>
                {qualifications.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Computer Level</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.computerLevel} onChange={set('computerLevel')}>
                {computerLevels.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Set App Password</label>
            <div className="auth-input-wrap">
              <input type="password" className="auth-input" placeholder="New password for student app" value={form.appPassword} onChange={set('appPassword')} />
            </div>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Address</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.address} onChange={set('address')} /></div>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Photo</label>
            <label className="feedback-add-image-btn assignment-attach-btn">
              <FontAwesomeIcon icon={faImage} /> {form.photoName || 'Choose New Photo'}
              <input type="file" accept="image/*" hidden onChange={(e) => setForm({ ...form, photoName: e.target.files?.[0]?.name || '' })} />
            </label>
          </div>
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditStudentPopup
