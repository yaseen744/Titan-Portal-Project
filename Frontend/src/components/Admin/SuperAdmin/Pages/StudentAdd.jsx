import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faCircleCheck, faImage } from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import {
  countries, citiesByCountry, campusesByCity, coursesByCampus, batchesByCourse,
  slotsBySchedule, genders, qualifications, computerLevels,
} from '../data/superAdminData.js'

const emptyForm = {
  country: '', city: '', campus: '', course: '', batch: '', slot: '',
  name: '', fatherName: '', email: '', phone: '', cnic: '', fatherCnic: '', fatherPhone: '',
  dob: '', gender: '', address: '', lastQualification: '', computerLevel: '', hasLaptop: '',
  photoName: '',
}

function StudentAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const set = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // Cascading resets
      if (field === 'country') { next.city = ''; next.campus = ''; next.course = ''; next.batch = ''; next.slot = '' }
      if (field === 'city') { next.campus = ''; next.course = ''; next.batch = ''; next.slot = '' }
      if (field === 'campus') { next.course = ''; next.batch = ''; next.slot = '' }
      if (field === 'course') { next.batch = ''; next.slot = '' }
      return next
    })
  }

  const cities = form.country ? citiesByCountry[form.country] || [] : []
  const campuses = form.city ? campusesByCity[form.city] || [] : []
  const courseList = form.campus ? coursesByCampus[form.campus] || [] : []

  const requiredFields = ['country', 'city', 'campus', 'course', 'batch', 'slot', 'name', 'fatherName', 'email', 'phone', 'cnic', 'dob', 'gender']

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    requiredFields.forEach((f) => {
      if (!form[f]) newErrors[f] = 'Required'
    })
    if (form.cnic && form.cnic.length < 13) newErrors.cnic = 'CNIC looks too short'
    if (form.email && !form.email.includes('@')) newErrors.email = 'Enter a valid email'
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setSaved(true)
    }
  }

  if (saved) {
    return (
      <div className="superadmin-page">
        <SuperAdminTopbar breadcrumb={['Home', 'Students', 'Add New']} />
        <div className="student-saved-box">
          <FontAwesomeIcon icon={faCircleCheck} className="student-saved-icon" />
          <h3 className="student-saved-heading">Student Registered!</h3>
          <p className="student-saved-text">
            {form.name} has been saved with status <strong>"pending"</strong>, and a registration
            fee voucher has been generated for them.
          </p>
          <div className="feedback-confirm-btn-row student-saved-btn-row">
            <button className="generic-popup-btn-outline" onClick={() => { setForm(emptyForm); setSaved(false) }}>
              Add Another
            </button>
            <button className="generic-popup-btn" onClick={() => navigate('/admin/superadmin/students')}>
              Back to Students
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="superadmin-page">
      <SuperAdminTopbar breadcrumb={['Home', 'Students', 'Add New']} />

      <form className="student-form-box" onSubmit={handleSubmit} noValidate>
        <h4 className="student-form-section-heading">Where will they study?</h4>
        <div className="student-form-grid">
          <div className="auth-input-group">
            <label className="auth-input-label">Country <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.country ? 'auth-input-wrap-error' : ''}`}>
              <select className="auth-input" value={form.country} onChange={set('country')}>
                <option value="">Select</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">City <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.city ? 'auth-input-wrap-error' : ''}`}>
              <select className="auth-input" value={form.city} onChange={set('city')} disabled={!form.country}>
                <option value="">Select</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Campus <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.campus ? 'auth-input-wrap-error' : ''}`}>
              <select className="auth-input" value={form.campus} onChange={set('campus')} disabled={!form.city}>
                <option value="">Select</option>
                {campuses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Course <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.course ? 'auth-input-wrap-error' : ''}`}>
              <select className="auth-input" value={form.course} onChange={set('course')} disabled={!form.campus}>
                <option value="">Select</option>
                {courseList.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Batch <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.batch ? 'auth-input-wrap-error' : ''}`}>
              <select className="auth-input" value={form.batch} onChange={set('batch')} disabled={!form.course}>
                <option value="">Select</option>
                {batchesByCourse.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Slot <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.slot ? 'auth-input-wrap-error' : ''}`}>
              <select className="auth-input" value={form.slot} onChange={set('slot')} disabled={!form.batch}>
                <option value="">Select</option>
                {slotsBySchedule.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <h4 className="student-form-section-heading">Student Details</h4>
        <div className="student-form-grid">
          <div className="auth-input-group">
            <label className="auth-input-label">Full Name <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.name ? 'auth-input-wrap-error' : ''}`}>
              <input className="auth-input" value={form.name} onChange={set('name')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Father Name <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.fatherName ? 'auth-input-wrap-error' : ''}`}>
              <input className="auth-input" value={form.fatherName} onChange={set('fatherName')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Email <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.email ? 'auth-input-wrap-error' : ''}`}>
              <input type="email" className="auth-input" value={form.email} onChange={set('email')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Phone <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.phone ? 'auth-input-wrap-error' : ''}`}>
              <input className="auth-input" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">CNIC <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.cnic ? 'auth-input-wrap-error' : ''}`}>
              <input className="auth-input" placeholder="42101-1234567-1" value={form.cnic} onChange={set('cnic')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Father's CNIC</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.fatherCnic} onChange={set('fatherCnic')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Father's Phone</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.fatherPhone} onChange={set('fatherPhone')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Date of Birth <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.dob ? 'auth-input-wrap-error' : ''}`}>
              <input type="date" className="auth-input" value={form.dob} onChange={set('dob')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Gender <span className="auth-required-star">*</span></label>
            <div className={`auth-input-wrap ${errors.gender ? 'auth-input-wrap-error' : ''}`}>
              <select className="auth-input" value={form.gender} onChange={set('gender')}>
                <option value="">Select</option>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group student-form-grid-full">
            <label className="auth-input-label">Address</label>
            <div className="auth-input-wrap">
              <input className="auth-input" value={form.address} onChange={set('address')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Last Qualification</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.lastQualification} onChange={set('lastQualification')}>
                <option value="">Select</option>
                {qualifications.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Computer Level</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.computerLevel} onChange={set('computerLevel')}>
                <option value="">Select</option>
                {computerLevels.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Do you have a laptop?</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={form.hasLaptop} onChange={set('hasLaptop')}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Student Photo</label>
            <label className="feedback-add-image-btn assignment-attach-btn">
              <FontAwesomeIcon icon={faImage} /> {form.photoName || 'Choose Photo'}
              <input type="file" accept="image/*" hidden onChange={(e) => setForm({ ...form, photoName: e.target.files?.[0]?.name || '' })} />
            </label>
          </div>
        </div>

        <button type="submit" className="auth-btn-primary student-form-submit-btn">
          <FontAwesomeIcon icon={faUserPlus} /> Register Student
        </button>
      </form>
    </div>
  )
}

export default StudentAdd
