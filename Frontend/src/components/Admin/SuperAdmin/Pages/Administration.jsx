import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import AddSlotPopup from '../Popups/AddSlotPopup.jsx'
import { slots as initialSlots, hasPermission } from '../data/superAdminData.js'

function Administration() {
  const [slots, setSlots] = useState(initialSlots)
  const [showAdd, setShowAdd] = useState(false)

  const toggleRegistration = (id) => {
    setSlots(slots.map((s) => (s.id === id ? { ...s, registrationOpen: !s.registrationOpen } : s)))
  }

  return (
    <div className="superadmin-page">
      <SuperAdminTopbar breadcrumb={['Home', 'Administration']} />

      <div className="course-tab-header-row">
        <h4 className="course-tab-heading">Slots (Class Groups)</h4>
        {hasPermission('SLOT', 'WRITE') && (
          <button type="button" className="course-tab-new-btn" onClick={() => setShowAdd(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add Slot
          </button>
        )}
      </div>

      <div className="slots-grid">
        {slots.map((slot) => (
          <div key={slot.id} className="slot-card">
            <div className="slot-card-header">
              <h5 className="slot-card-course">{slot.course}</h5>
              <span className={`slot-card-registration-chip ${slot.registrationOpen ? 'slot-open' : 'slot-closed'}`}>
                <FontAwesomeIcon icon={slot.registrationOpen ? faLockOpen : faLock} /> {slot.registrationOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            <p className="slot-card-line"><strong>Schedule:</strong> {slot.schedule}</p>
            <p className="slot-card-line"><strong>Trainer:</strong> {slot.trainer}</p>
            <p className="slot-card-line"><strong>Campus:</strong> {slot.campus}</p>
            <p className="slot-card-line"><strong>Type:</strong> {slot.classType} &nbsp;|&nbsp; <strong>Gender:</strong> {slot.gender}</p>
            <p className="slot-card-line"><strong>Duration:</strong> {slot.startDate} – {slot.endDate}</p>

            <div className="slot-card-seats-row">
              <span>Seats: {slot.seatsUsed}/{slot.capacity}</span>
              <div className="course-card-progress-track slot-card-seats-track">
                <div
                  className="course-card-progress-fill"
                  style={{ width: `${Math.min(100, Math.round((slot.seatsUsed / slot.capacity) * 100))}%` }}
                ></div>
              </div>
            </div>

            {hasPermission('SLOT', 'UPDATE') && (
              <button type="button" className="slot-toggle-btn" onClick={() => toggleRegistration(slot.id)}>
                <FontAwesomeIcon icon={slot.registrationOpen ? faLock : faLockOpen} />
                {slot.registrationOpen ? ' Close Registration' : ' Open Registration'}
              </button>
            )}
          </div>
        ))}
      </div>

      <AddSlotPopup show={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  )
}

export default Administration
