import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserPen, faImage, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { genders, qualifications, computerLevels } from '../../../shared/permissionsConfig.js'
import { api } from '../../../../../api/client.js'

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
    photo: student.photo || '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
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
    setSaving(true)
    try {
      const updated = await api.put(`/students/${student._id}`, form)
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
            <FontAwesomeIcon icon={faUserPen} /> Edit Student
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

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
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Address</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.address} onChange={set('address')} /></div>
          </div>
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Photo</label>
            <label className="feedback-add-image-btn assignment-attach-btn">
              <FontAwesomeIcon icon={uploadingPhoto ? faSpinner : faImage} spin={uploadingPhoto} />
              {uploadingPhoto ? 'Uploading...' : form.photo ? 'Photo selected — change?' : 'Choose New Photo'}
              <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            </label>
          </div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>Back</button>
          <button className="generic-popup-btn" onClick={handleSave} disabled={saving || uploadingPhoto}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditStudentPopup
