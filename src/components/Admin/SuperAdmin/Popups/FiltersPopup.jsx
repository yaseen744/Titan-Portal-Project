import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faFilter } from '@fortawesome/free-solid-svg-icons'
import {
  countries, citiesByCountry, campusesByCity, coursesByCampus, batchesByCourse,
  slotsBySchedule, genders, statusOptions, paymentStatusOptions,
} from '../data/superAdminData.js'

const defaultFilters = {
  fromDate: '', toDate: '', country: '', city: '', campus: '', course: '',
  batch: '', slot: '', status: '', paymentMonth: '', paymentStatus: '',
  gender: '', laptop: '', year: '', sponsorship: '',
}

function FiltersPopup({ show, onClose, onApply }) {
  const [filters, setFilters] = useState(defaultFilters)

  if (!show) return null

  const set = (field) => (e) => setFilters({ ...filters, [field]: e.target.value })

  const allCities = filters.country ? citiesByCountry[filters.country] || [] : []
  const allCampuses = filters.city ? campusesByCity[filters.city] || [] : []
  const allCourses = filters.campus ? coursesByCampus[filters.campus] || [] : []

  return (
    <div className="generic-popup-overlay">
      <div className="filters-popup-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faFilter} /> Filters
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="filters-grid">
          <div className="auth-input-group">
            <label className="auth-input-label">From Date</label>
            <div className="auth-input-wrap">
              <input type="date" className="auth-input" value={filters.fromDate} onChange={set('fromDate')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">To Date</label>
            <div className="auth-input-wrap">
              <input type="date" className="auth-input" value={filters.toDate} onChange={set('toDate')} />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Country</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.country} onChange={set('country')}>
                <option value="">Any</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">City</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.city} onChange={set('city')}>
                <option value="">Any</option>
                {allCities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Campus</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.campus} onChange={set('campus')}>
                <option value="">Any</option>
                {allCampuses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Course</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.course} onChange={set('course')}>
                <option value="">Any</option>
                {allCourses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Batch</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.batch} onChange={set('batch')}>
                <option value="">Any</option>
                {batchesByCourse.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Slot</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.slot} onChange={set('slot')}>
                <option value="">Any</option>
                {slotsBySchedule.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Status</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.status} onChange={set('status')}>
                <option value="">Any</option>
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Payment Status</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.paymentStatus} onChange={set('paymentStatus')}>
                <option value="">Any</option>
                {paymentStatusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Payment Month</label>
            <div className="auth-input-wrap">
              <input type="month" className="auth-input" value={filters.paymentMonth} onChange={set('paymentMonth')} />
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Gender</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.gender} onChange={set('gender')}>
                <option value="">Any</option>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Has Laptop</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.laptop} onChange={set('laptop')}>
                <option value="">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">Year</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.year} onChange={set('year')}>
                <option value="">Any</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>

          <div className="auth-input-group filters-grid-full">
            <label className="auth-input-label">Sponsorship</label>
            <div className="auth-input-wrap">
              <select className="auth-input" value={filters.sponsorship} onChange={set('sponsorship')}>
                <option value="">Any</option>
                <option value="Sponsored">Sponsored</option>
                <option value="Self-funded">Self-funded</option>
              </select>
            </div>
          </div>
        </div>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={() => setFilters(defaultFilters)}>
            Reset
          </button>
          <button
            className="generic-popup-btn"
            onClick={() => {
              onApply(filters)
              onClose()
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FiltersPopup
