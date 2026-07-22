import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faPlus, faPenToSquare, faUserLock, faUserCheck, faUserShield,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import SubAdminPopup from '../Popups/SubAdminPopup.jsx'
import SubAdminStatusPopup from '../Popups/SubAdminStatusPopup.jsx'
import { subAdmins as initialSubAdmins } from '../data/superAdminData.js'

function SubAdmins() {
  const [allSubAdmins, setAllSubAdmins] = useState(initialSubAdmins)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [statusTarget, setStatusTarget] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return allSubAdmins
    const q = search.trim().toLowerCase()
    return allSubAdmins.filter((a) =>
      a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) ||
      a.campus.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
    )
  }, [allSubAdmins, search])

  const handleCreate = (form) => {
    const newRecord = {
      id: `SA${String(allSubAdmins.length + 1).padStart(3, '0')}`,
      name: form.name, email: form.email, role: form.role,
      country: 'Pakistan', city: form.city, campus: form.campus, phone: form.phone,
      gender: form.gender, status: 'active', photo: '', permissionKeys: form.permissionKeys,
    }
    setAllSubAdmins([newRecord, ...allSubAdmins])
  }

  const handleUpdate = (form) => {
    setAllSubAdmins(allSubAdmins.map((a) => (a.id === editing.id
      ? { ...a, name: form.name, email: form.email, role: form.role, city: form.city, campus: form.campus, phone: form.phone, gender: form.gender, permissionKeys: form.permissionKeys }
      : a)))
  }

  const handleStatusChange = (id, status) => {
    setAllSubAdmins(allSubAdmins.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  return (
    <div className="superadmin-page">
      <SuperAdminTopbar breadcrumb={['Home', 'Sub Admins']} />

      <div className="students-toolbar">
        <div className="course-landing-search-wrap students-search-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="course-landing-search-icon" />
          <input
            type="text"
            className="course-landing-search-input"
            placeholder="Search by name, email, campus or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button type="button" className="subadmin-toolbar-btn subadmin-toolbar-btn-primary" onClick={() => setShowAdd(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Sub Admin
        </button>
      </div>

      <div className="superadmin-subadmin-grid">
        {filtered.map((a) => (
          <div key={a.id} className={`superadmin-subadmin-card ${a.status === 'suspended' ? 'superadmin-subadmin-card-suspended' : ''}`}>
            <div className="superadmin-subadmin-card-top">
              <Avatar name={a.name} photoUrl={a.photo} className="superadmin-subadmin-avatar" />
              <div className="superadmin-subadmin-card-heading">
                <h5 className="superadmin-subadmin-name">{a.name}</h5>
                <span className="superadmin-subadmin-email">{a.email}</span>
              </div>
              <span className={`superadmin-subadmin-status-chip ${a.status === 'active' ? 'superadmin-subadmin-status-active' : 'superadmin-subadmin-status-suspended'}`}>
                {a.status}
              </span>
            </div>

            <div className="superadmin-subadmin-card-body">
              <span className="superadmin-subadmin-role-badge">
                <FontAwesomeIcon icon={faUserShield} /> {a.role}
              </span>
              <p className="superadmin-subadmin-campus-line">{a.campus}, {a.city}</p>
              <p className="superadmin-subadmin-perm-line">
                <FontAwesomeIcon icon={faShieldHalved} /> {a.permissionKeys.length} permission modules enabled
              </p>
            </div>

            <div className="superadmin-subadmin-card-actions">
              <button type="button" className="subadmin-toolbar-btn superadmin-subadmin-action-btn" onClick={() => setEditing(a)}>
                <FontAwesomeIcon icon={faPenToSquare} /> Edit
              </button>
              <button
                type="button"
                className={`subadmin-toolbar-btn superadmin-subadmin-action-btn ${a.status === 'active' ? 'superadmin-subadmin-suspend-btn' : 'superadmin-subadmin-activate-btn'}`}
                onClick={() => setStatusTarget(a)}
              >
                <FontAwesomeIcon icon={a.status === 'active' ? faUserLock : faUserCheck} />
                {a.status === 'active' ? ' Suspend' : ' Activate'}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && <p className="attendance-no-record">No sub admins match your search.</p>}
      </div>

      {showAdd && (
        <SubAdminPopup key="add" initial={null} onClose={() => setShowAdd(false)} onSave={handleCreate} />
      )}
      {editing && (
        <SubAdminPopup key={editing.id} initial={editing} onClose={() => setEditing(null)} onSave={handleUpdate} />
      )}
      <SubAdminStatusPopup subAdmin={statusTarget} onClose={() => setStatusTarget(null)} onConfirm={handleStatusChange} />
    </div>
  )
}

export default SubAdmins
