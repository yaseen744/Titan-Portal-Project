import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faChalkboardUser, faCircleCheck, faImage } from '@fortawesome/free-solid-svg-icons'
import { citiesByCountry, campusesByCity, coursesByCampus } from '../data/subAdminData.js'

function AddTrainerPopup({ show, onClose }) {
  const [form, setForm] = useState({
    city: '', campus: '', course: '', name: '', nameUrdu: '', bio: '', phone: '',
    email: '', employeeId: '', hourlyRate: '', password: '', socialLink: '', photoName: '',
  })
  const [created, setCreated] = useState(false)

  if (!show) return null

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const cities = citiesByCountry.Pakistan
  const campuses = form.city ? campusesByCity[form.city] || [] : []
  const courseList = form.campus ? coursesByCampus[form.campus] || [] : []

  const handleClose = () => {
    setForm({ city: '', campus: '', course: '', name: '', nameUrdu: '', bio: '', phone: '', email: '', employeeId: '', hourlyRate: '', password: '', socialLink: '', photoName: '' })
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
          <h3 className="generic-popup-title">Trainer Added!</h3>
          <p className="generic-popup-text">
            {form.name || 'The trainer'} has been added with a unique Employee ID for attendance
            scanning. (Frontend demo — nothing is saved until the backend is connected.)
          </p>
          <button className="generic-popup-btn" onClick={handleClose}>Okay</button>
        </div>
      </div>
    )
  }

  return (
    <div className="generic-popup-overlay">
      <div className="edit-profile-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faChalkboardUser} /> Add Trainer
          </span>
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="edit-profile-grid">
          <div className="auth-input-group">
            <label className="auth-input-label">Name</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.name} onChange={set('name')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Name (Urdu)</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.nameUrdu} onChange={set('nameUrdu')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">City</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.city} onChange={set('city')}>
                <option value="">Select</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Campus</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.campus} onChange={set('campus')} disabled={!form.city}>
                <option value="">Select</option>
                {campuses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Courses Taught</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.course} onChange={set('course')} disabled={!form.campus}>
                <option value="">Select</option>
                {courseList.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Phone</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.phone} onChange={set('phone')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Email</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.email} onChange={set('email')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Employee ID</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.employeeId} onChange={set('employeeId')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Hourly Rate</label>
            <div className="auth-input-wrap"><input className="auth-input" placeholder="2000/hour" value={form.hourlyRate} onChange={set('hourlyRate')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Password</label>
            <div className="auth-input-wrap"><input type="password" className="auth-input" value={form.password} onChange={set('password')} /></div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Social Link</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.socialLink} onChange={set('socialLink')} /></div>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Bio</label>
            <textarea className="feedback-textarea" rows={2} value={form.bio} onChange={set('bio')}></textarea>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Photo</label>
            <label className="feedback-add-image-btn assignment-attach-btn">
              <FontAwesomeIcon icon={faImage} /> {form.photoName || 'Choose Photo'}
              <input type="file" accept="image/*" hidden onChange={(e) => setForm({ ...form, photoName: e.target.files?.[0]?.name || '' })} />
            </label>
          </div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={handleClose}>Back</button>
          <button className="generic-popup-btn" onClick={() => setCreated(true)}>Add Trainer</button>
        </div>
      </div>
    </div>
  )
}

export default AddTrainerPopup
