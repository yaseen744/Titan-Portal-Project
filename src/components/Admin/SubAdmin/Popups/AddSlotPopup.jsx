import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faLayerGroup, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { citiesByCountry, campusesByCity, coursesByCampus, genders, trainers } from '../data/subAdminData.js'

const classTypes = ['Regular', 'Kids', 'Vocational']

function AddSlotPopup({ show, onClose }) {
  const [form, setForm] = useState({
    schedule: '', city: '', campus: '', course: '', trainer: '', classType: 'Regular',
    gender: '', startDate: '', endDate: '', capacity: '', hourlyRate: '', whatsappLink: '',
  })
  const [created, setCreated] = useState(false)

  if (!show) return null

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const cities = citiesByCountry.Pakistan
  const campuses = form.city ? campusesByCity[form.city] || [] : []
  const courseList = form.campus ? coursesByCampus[form.campus] || [] : []

  const handleClose = () => {
    setForm({ schedule: '', city: '', campus: '', course: '', trainer: '', classType: 'Regular', gender: '', startDate: '', endDate: '', capacity: '', hourlyRate: '', whatsappLink: '' })
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
          <h3 className="generic-popup-title">Slot Created!</h3>
          <p className="generic-popup-text">
            The new slot has been added with registration open. (Frontend demo — nothing is saved
            until the backend is connected.)
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
            <FontAwesomeIcon icon={faLayerGroup} /> Add Slot
          </span>
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="edit-profile-grid">
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Schedule (days &amp; time)</label>
            <div className="auth-input-wrap">
              <input className="auth-input" placeholder="Mon/Wed/Fri 04:00 PM - 06:00 PM" value={form.schedule} onChange={set('schedule')} />
            </div>
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
          <div className="auth-input-group">
            <label className="auth-input-label">Course</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.course} onChange={set('course')} disabled={!form.campus}>
                <option value="">Select</option>
                {courseList.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Trainer</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.trainer} onChange={set('trainer')}>
                <option value="">Select</option>
                {trainers.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Class Type</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.classType} onChange={set('classType')}>
                {classTypes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Gender</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.gender} onChange={set('gender')}>
                <option value="">Select</option>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Start Date</label>
            <div className="auth-input-wrap">
              <input type="date" className="auth-input" value={form.startDate} onChange={set('startDate')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">End Date</label>
            <div className="auth-input-wrap">
              <input type="date" className="auth-input" value={form.endDate} onChange={set('endDate')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Capacity (seats)</label>
            <div className="auth-input-wrap">
              <input type="number" className="auth-input" value={form.capacity} onChange={set('capacity')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Trainer Hourly Rate</label>
            <div className="auth-input-wrap">
              <input className="auth-input" placeholder="2000/hour" value={form.hourlyRate} onChange={set('hourlyRate')} />
            </div>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">WhatsApp Group Link</label>
            <div className="auth-input-wrap">
              <input className="auth-input" placeholder="https://chat.whatsapp.com/..." value={form.whatsappLink} onChange={set('whatsappLink')} />
            </div>
          </div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={handleClose}>Back</button>
          <button className="generic-popup-btn" onClick={() => setCreated(true)}>Create Slot</button>
        </div>
      </div>
    </div>
  )
}

export default AddSlotPopup
