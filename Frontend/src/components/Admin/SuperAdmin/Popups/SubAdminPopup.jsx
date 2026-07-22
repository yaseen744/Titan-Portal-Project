import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserShield, faCircleCheck, faImage, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import {
  citiesByCountry, campusesByCity, roleTemplates, roleTemplatePermissions,
  permissions, subAdminPermissionKeys, genders,
} from '../data/superAdminData.js'

const actionsOrder = ['READ', 'WRITE', 'UPDATE', 'EXPORT']

const emptyForm = {
  name: '', email: '', phone: '', gender: '', role: 'Campus Manager',
  city: '', campus: '', password: '', photoName: '',
}

// One popup handles both "Add Sub Admin" and "Edit Sub Admin" - which mode
// it's in depends on whether an `initial` record was passed in. The parent
// only mounts this component while it should be visible (and remounts it
// with a fresh `key` each time), so plain lazy useState is enough to seed
// the form - no effect needed to "reset" anything.
function SubAdminPopup({ initial, onClose, onSave }) {
  const [form, setForm] = useState(() => (initial
    ? {
      name: initial.name, email: initial.email, phone: initial.phone,
      gender: initial.gender, role: initial.role, city: initial.city,
      campus: initial.campus, password: '', photoName: '',
    }
    : emptyForm))
  const [permissionKeys, setPermissionKeys] = useState(() => (
    initial ? (initial.permissionKeys || []) : (roleTemplatePermissions['Campus Manager'] || [])
  ))
  const [saved, setSaved] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const cities = citiesByCountry.Pakistan
  const campuses = form.city ? campusesByCity[form.city] || [] : []

  const applyRoleTemplate = (role) => {
    setForm({ ...form, role })
    setPermissionKeys(roleTemplatePermissions[role] || [])
  }

  const togglePermission = (key) => {
    setPermissionKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const handleClose = () => {
    setForm(emptyForm)
    setPermissionKeys([])
    setSaved(false)
    onClose()
  }

  if (saved) {
    return (
      <div className="generic-popup-overlay">
        <div className="generic-popup-card">
          <div className="generic-popup-icon-wrap">
            <FontAwesomeIcon icon={faCircleCheck} className="generic-popup-icon" />
          </div>
          <h3 className="generic-popup-title">{initial ? 'Sub Admin Updated!' : 'Sub Admin Created!'}</h3>
          <p className="generic-popup-text">
            {form.name || 'The account'} now has {permissionKeys.length} permission module{permissionKeys.length === 1 ? '' : 's'} enabled
            for {form.campus || 'their campus'}. (Frontend demo — nothing is saved until the backend is connected.)
          </p>
          <button className="generic-popup-btn" onClick={handleClose}>Okay</button>
        </div>
      </div>
    )
  }

  return (
    <div className="generic-popup-overlay">
      <div className="edit-profile-card subadmin-popup-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faUserShield} /> {initial ? 'Edit Sub Admin' : 'Add Sub Admin'}
          </span>
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="edit-profile-grid">
          <div className="auth-input-group">
            <label className="auth-input-label">Full Name</label>
            <div className="auth-input-wrap"><input className="auth-input" value={form.name} onChange={set('name')} /></div>
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
                <option value="">Select</option>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">City</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value, campus: '' })}>
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
          {!initial && (
            <div className="auth-input-group">
              <label className="auth-input-label">Temporary Password</label>
              <div className="auth-input-wrap"><input type="password" className="auth-input" value={form.password} onChange={set('password')} /></div>
            </div>
          )}
          <div className="auth-input-group edit-profile-grid-full">
            <label className="auth-input-label">Photo</label>
            <label className="feedback-add-image-btn assignment-attach-btn">
              <FontAwesomeIcon icon={faImage} /> {form.photoName || 'Choose Photo'}
              <input type="file" accept="image/*" hidden onChange={(e) => setForm({ ...form, photoName: e.target.files?.[0]?.name || '' })} />
            </label>
          </div>
        </div>

        <h4 className="student-form-section-heading subadmin-role-heading">
          <FontAwesomeIcon icon={faWandMagicSparkles} /> Role Template
        </h4>
        <div className="subadmin-role-chip-row">
          {roleTemplates.map((role) => (
            <button
              type="button"
              key={role}
              className={`subadmin-role-chip ${form.role === role ? 'subadmin-role-chip-active' : ''}`}
              onClick={() => applyRoleTemplate(role)}
            >
              {role}
            </button>
          ))}
        </div>
        <p className="subadmin-role-hint">
          Picking a role fills in a sensible starting set of permissions below — fine-tune anything before saving.
        </p>

        <h4 className="student-form-section-heading">
          <FontAwesomeIcon icon={faUserShield} /> Permissions
        </h4>
        <div className="subadmin-permission-matrix">
          <div className="subadmin-permission-matrix-head">
            <span>Module</span>
            {actionsOrder.map((a) => <span key={a} className="subadmin-permission-matrix-action-head">{a}</span>)}
          </div>
          {permissions.filter((p) => subAdminPermissionKeys.includes(p.key)).map((p) => {
            const enabled = permissionKeys.includes(p.key)
            return (
              <div key={p.key} className={`subadmin-permission-matrix-row ${enabled ? 'subadmin-permission-matrix-row-enabled' : ''}`}>
                <button type="button" className="subadmin-permission-matrix-label" onClick={() => togglePermission(p.key)}>
                  <span className={`subadmin-permission-toggle ${enabled ? 'subadmin-permission-toggle-on' : ''}`}></span>
                  {p.label}
                </button>
                {actionsOrder.map((a) => (
                  <span key={a} className={`subadmin-permission-matrix-cell ${enabled && p.actions.includes(a) ? 'subadmin-permission-matrix-cell-on' : ''}`}>
                    {enabled && p.actions.includes(a) ? <FontAwesomeIcon icon={faCircleCheck} /> : '—'}
                  </span>
                ))}
              </div>
            )
          })}
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={handleClose}>Back</button>
          <button className="generic-popup-btn" onClick={() => { onSave({ ...form, permissionKeys }); setSaved(true) }}>
            {initial ? 'Save Changes' : 'Create Sub Admin'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubAdminPopup
