import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSchool, faUserGraduate, faChalkboardUser, faLayerGroup, faCity } from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import CampusPopup from '../Popups/CampusPopup.jsx'
import { campusesByCity, coursesByCampus, students, trainers, slots, subAdmins } from '../data/superAdminData.js'

function Campuses() {
  const [showAdd, setShowAdd] = useState(false)

  const campusList = Object.entries(campusesByCity).flatMap(([city, campuses]) =>
    campuses.map((campus) => ({ city, campus }))
  )

  return (
    <div className="superadmin-page">
      <SuperAdminTopbar breadcrumb={['Home', 'Campuses']} />

      <div className="course-tab-header-row">
        <h4 className="course-tab-heading">
          <FontAwesomeIcon icon={faCity} /> Campuses ({campusList.length})
        </h4>
        <button type="button" className="course-tab-new-btn" onClick={() => setShowAdd(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Campus
        </button>
      </div>

      <div className="superadmin-campus-grid">
        {campusList.map(({ city, campus }) => {
          const campusStudents = students.filter((s) => s.campus === campus).length
          const campusTrainers = trainers.filter((t) => t.campus === campus).length
          const campusSlots = slots.filter((s) => s.campus === campus).length
          const campusSubAdmins = subAdmins.filter((a) => a.campus === campus).length
          const courses = coursesByCampus[campus] || []

          return (
            <div key={campus} className="superadmin-campus-card">
              <div className="superadmin-campus-card-top">
                <span className="superadmin-campus-icon-wrap">
                  <FontAwesomeIcon icon={faSchool} />
                </span>
                <div>
                  <h5 className="superadmin-campus-name">{campus}</h5>
                  <span className="superadmin-campus-city">{city}, Pakistan</span>
                </div>
              </div>

              <div className="superadmin-campus-courses">
                {courses.map((c) => <span key={c} className="superadmin-campus-course-chip">{c}</span>)}
              </div>

              <div className="superadmin-campus-stat-row">
                <span className="superadmin-campus-stat">
                  <FontAwesomeIcon icon={faUserGraduate} /> {campusStudents} Students
                </span>
                <span className="superadmin-campus-stat">
                  <FontAwesomeIcon icon={faChalkboardUser} /> {campusTrainers} Trainers
                </span>
                <span className="superadmin-campus-stat">
                  <FontAwesomeIcon icon={faLayerGroup} /> {campusSlots} Slots
                </span>
                <span className="superadmin-campus-stat">
                  <FontAwesomeIcon icon={faUserGraduate} /> {campusSubAdmins} Staff
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <CampusPopup show={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  )
}

export default Campuses
