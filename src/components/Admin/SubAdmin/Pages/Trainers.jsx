import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEye, faIdBadge } from '@fortawesome/free-solid-svg-icons'
import SubAdminTopbar from '../Layout/SubAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import AddTrainerPopup from '../Popups/AddTrainerPopup.jsx'
import TrainerDetailPopup from '../Popups/TrainerDetailPopup.jsx'
import { trainers, hasPermission } from '../data/subAdminData.js'

function Trainers() {
  const [showAdd, setShowAdd] = useState(false)
  const [viewing, setViewing] = useState(null)

  return (
    <div className="subadmin-page">
      <SubAdminTopbar breadcrumb={['Home', 'Trainers']} />

      <div className="course-tab-header-row">
        <h4 className="course-tab-heading">Trainers</h4>
        {hasPermission('TRAINER', 'WRITE') && (
          <button type="button" className="course-tab-new-btn" onClick={() => setShowAdd(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add Trainer
          </button>
        )}
      </div>

      <div className="course-tab-box">
        <div className="student-row-head trainers-row-head">
          <span>Photo</span>
          <span>Name</span>
          <span>Email</span>
          <span><FontAwesomeIcon icon={faIdBadge} /> Employee ID</span>
          <span>Campus</span>
          <span>Action</span>
        </div>

        {trainers.map((t) => (
          <div key={t.id} className="student-row trainers-row">
            <Avatar name={t.name} photoUrl={t.photo} className="student-row-photo" />
            <span className="student-row-name">{t.name}</span>
            <span className="student-row-email">{t.email}</span>
            <span>{t.employeeId}</span>
            <span className="students-row-course">{t.campus}</span>
            <span>
              <FontAwesomeIcon icon={faEye} className="assignment-action-icon" title="View" onClick={() => setViewing(t)} />
            </span>
          </div>
        ))}
      </div>

      <AddTrainerPopup show={showAdd} onClose={() => setShowAdd(false)} />
      {viewing && <TrainerDetailPopup trainer={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}

export default Trainers
