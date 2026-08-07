import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserPen, faImage, faSpinner, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { api } from '../../../../api/client.js'

// Only the fields a student is actually allowed to self-edit per the spec -
// address, course, roll, trainer/batch etc. stay Sub-Admin-controlled and
// aren't shown here at all. CNIC and Father's CNIC ARE self-editable since
// the student portal itself logs in with the student's CNIC.
function EditProfilePopup({ show, info, onClose, onSave }) {
  const [form, setForm] = useState({
    name: info.name, phone: info.phone, email: info.email,
    gender: info.gender, dob: info.dob ? info.dob.slice(0, 10) : '', photo: info.photo || '',
    cnic: info.cnic || '', fatherCnic: info.fatherCnic || '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  if (!show) return null

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    setError('')
    try {
      const { url } = await api.uploadImage(file)
      setForm((f) => ({ ...f, photo: url }))
    } catch (err) {
      setError(err.message || 'Photo upload failed.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSave = async () => {
    setError('')
    if (form.cnic && form.cnic.replace(/\D/g, '').length < 13) {
      setError('CNIC looks too short.')
      return
    }
    setSaving(true)
    try {
      const updated = await api.put('/students/me/profile', form)
      onSave(updated)
      onClose()
    } catch (err) {
      setError(err.message || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

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

        {error && <div className="auth-error-banner">{error}</div>}

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
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Date of Birth</label>
            <div className="auth-input-wrap">
              <input type="date" className="auth-input" value={form.dob} onChange={handleChange('dob')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label"><FontAwesomeIcon icon={faIdCard} /> CNIC</label>
            <div className="auth-input-wrap">
              <input className="auth-input" placeholder="42101-1234567-1" value={form.cnic} onChange={handleChange('cnic')} />
            </div>
            <span className="subadmin-role-hint">You log in with this CNIC — changing it changes your login ID too.</span>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label"><FontAwesomeIcon icon={faIdCard} /> Father's CNIC</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.fatherCnic} onChange={handleChange('fatherCnic')} />
            </div>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Profile Image</label>
            <label className="feedback-add-image-btn assignment-attach-btn">
              <FontAwesomeIcon icon={uploadingPhoto ? faSpinner : faImage} spin={uploadingPhoto} />
              {uploadingPhoto ? 'Uploading...' : form.photo ? 'Photo selected — change?' : 'Choose Photo'}
              <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            </label>
          </div>
        </div>

        <p className="subadmin-role-hint">
          Address, course and trainer/batch details are managed by your Sub Admin.
        </p>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>
            Back
          </button>
          <button className="generic-popup-btn" disabled={saving || uploadingPhoto} onClick={handleSave}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePopup
