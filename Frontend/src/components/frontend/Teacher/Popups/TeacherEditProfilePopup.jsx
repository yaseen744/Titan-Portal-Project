import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserPen, faImage, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { api } from '../../../../api/client.js'

function TeacherEditProfilePopup({ show, info, onClose, onSave }) {
  const [form, setForm] = useState({
    name: info.name, phone: info.phone, email: info.email, bio: info.bio || '',
    designation: info.designation || '', photo: info.photo || '',
    linkUrl: info.socialLinks?.[0]?.url || '',
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
      const updated = await api.put('/teachers/me/profile', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        bio: form.bio,
        designation: form.designation,
        photo: form.photo,
        socialLinks: form.linkUrl ? [{ platform: 'Link', url: form.linkUrl }] : [],
      })
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

        <div className="auth-input-group">
          <label className="auth-input-label">Name</label>
          <div className="auth-input-wrap"><input className="auth-input" value={form.name} onChange={handleChange('name')} /></div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Number</label>
          <div className="auth-input-wrap"><input className="auth-input" value={form.phone} onChange={handleChange('phone')} /></div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Email</label>
          <div className="auth-input-wrap"><input className="auth-input" value={form.email} onChange={handleChange('email')} /></div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Designation</label>
          <div className="auth-input-wrap"><input className="auth-input" placeholder="Full Stack Web Developer" value={form.designation} onChange={handleChange('designation')} /></div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Social Link</label>
          <div className="auth-input-wrap">
            <input className="auth-input" placeholder="https://linkedin.com/in/your-profile" value={form.linkUrl} onChange={handleChange('linkUrl')} />
          </div>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Bio</label>
          <textarea className="feedback-textarea" rows={3} value={form.bio} onChange={handleChange('bio')} placeholder="Tell students a little about yourself"></textarea>
        </div>
        <div className="auth-input-group">
          <label className="auth-input-label">Photo</label>
          <label className="feedback-add-image-btn assignment-attach-btn">
            <FontAwesomeIcon icon={uploadingPhoto ? faSpinner : faImage} spin={uploadingPhoto} />
            {uploadingPhoto ? 'Uploading...' : form.photo ? 'Photo selected — change?' : 'Choose Photo'}
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </label>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>Back</button>
          <button className="generic-popup-btn" disabled={saving || uploadingPhoto} onClick={handleSave}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeacherEditProfilePopup
