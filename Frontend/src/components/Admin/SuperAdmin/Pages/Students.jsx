import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faFilter, faFileExport, faPlus, faEye, faTag,
  faPenToSquare, faPaperPlane, faDownload, faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import FiltersPopup from '../Popups/FiltersPopup.jsx'
import ChangeStatusPopup from '../Popups/ChangeStatusPopup.jsx'
import PaymentsPopup from '../Popups/PaymentsPopup.jsx'
import { students as initialStudents, hasPermission } from '../data/superAdminData.js'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

function statusChipClass(status) {
  if (status === 'enrolled' || status === 'approved' || status === 'passed' || status === 'completed') return 'student-status-good'
  if (status === 'pending') return 'student-status-pending'
  return 'student-status-bad'
}

function paymentChipClass(status) {
  if (status === 'Paid') return 'student-payment-good'
  if (status === 'Pending') return 'student-payment-pending'
  return 'student-payment-none'
}

function Students() {
  const navigate = useNavigate()
  const [allStudents, setAllStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [appliedFilters, setAppliedFilters] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusTarget, setStatusTarget] = useState(null)
  const [paymentsTarget, setPaymentsTarget] = useState(null)
  const [downloadNote, setDownloadNote] = useState(null)

  const filtered = useMemo(() => {
    let list = allStudents
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) || s.roll.includes(q) || s.cnic.includes(q) || s.phone.includes(q)
      )
    }
    if (appliedFilters) {
      const f = appliedFilters
      if (f.country) list = list.filter((s) => s.country === f.country)
      if (f.city) list = list.filter((s) => s.city === f.city)
      if (f.campus) list = list.filter((s) => s.campus === f.campus)
      if (f.course) list = list.filter((s) => s.course === f.course)
      if (f.batch) list = list.filter((s) => s.batch === f.batch)
      if (f.slot) list = list.filter((s) => s.slot === f.slot)
      if (f.status) list = list.filter((s) => s.status === f.status)
      if (f.paymentStatus) list = list.filter((s) => s.paymentStatus === f.paymentStatus)
      if (f.gender) list = list.filter((s) => s.gender === f.gender)
      if (f.laptop) list = list.filter((s) => (f.laptop === 'yes' ? s.hasLaptop : !s.hasLaptop))
      if (f.sponsorship) list = list.filter((s) => s.sponsorship === f.sponsorship)
    }
    return list
  }, [allStudents, search, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  const handleStatusSave = (id, newStatus) => {
    setAllStudents(allStudents.map((s) => (s.id === id ? { ...s, status: newStatus } : s)))
  }

  return (
    <div className="superadmin-page">
      <SuperAdminTopbar breadcrumb={['Home', 'Students']} />

      <div className="students-toolbar">
        <div className="course-landing-search-wrap students-search-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="course-landing-search-icon" />
          <input
            type="text"
            className="course-landing-search-input"
            placeholder="Search by name, roll, CNIC or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        <button type="button" className="superadmin-toolbar-btn" onClick={() => setShowFilters(true)}>
          <FontAwesomeIcon icon={faFilter} /> Filters
        </button>

        {hasPermission('STUDENT_EXPORT') && (
          <button type="button" className="superadmin-toolbar-btn" onClick={() => setDownloadNote('export')}>
            <FontAwesomeIcon icon={faFileExport} /> Export
          </button>
        )}

        {hasPermission('STUDENT', 'WRITE') && (
          <button type="button" className="superadmin-toolbar-btn superadmin-toolbar-btn-primary" onClick={() => navigate('/admin/superadmin/students/add')}>
            <FontAwesomeIcon icon={faPlus} /> Add New
          </button>
        )}
      </div>

      <div className="students-table-box">
        <div className="students-table-head">
          <span>Roll No</span>
          <span>Student Name</span>
          <span>Father Name</span>
          <span>CNIC</span>
          <span>Phone</span>
          <span>Course</span>
          <span>Status</span>
          <span>Payment Status</span>
          <span>Action</span>
        </div>

        {pageItems.map((s) => (
          <div key={s.id} className="students-table-row">
            <span className="students-row-roll">{s.roll}</span>
            <span className="students-row-name">{s.name}</span>
            <span>{s.fatherName}</span>
            <span>{s.cnic}</span>
            <span>{s.phone}</span>
            <span className="students-row-course">{s.course}</span>
            <span className={`student-status-chip ${statusChipClass(s.status)}`}>{s.status}</span>
            <span className={`student-payment-chip ${paymentChipClass(s.paymentStatus)}`}>{s.paymentStatus}</span>
            <span className="students-row-actions">
              <FontAwesomeIcon icon={faEye} className="assignment-action-icon" title="View" onClick={() => navigate(`/admin/superadmin/students/${s.id}`)} />
              {hasPermission('STUDENT', 'UPDATE') && (
                <FontAwesomeIcon icon={faTag} className="assignment-action-icon" title="Change Status" onClick={() => setStatusTarget(s)} />
              )}
              {hasPermission('STUDENT', 'UPDATE') && (
                <FontAwesomeIcon icon={faPenToSquare} className="assignment-action-icon" title="Edit" onClick={() => navigate(`/admin/superadmin/students/${s.id}`, { state: { openEdit: true } })} />
              )}
              <FontAwesomeIcon icon={faPaperPlane} className="assignment-action-icon" title="Payments" onClick={() => setPaymentsTarget(s)} />
              <FontAwesomeIcon icon={faDownload} className="assignment-action-icon" title="Download Record" onClick={() => setDownloadNote('record')} />
            </span>
          </div>
        ))}

        {pageItems.length === 0 && <p className="attendance-no-record">No students match your search/filters.</p>}

        <div className="students-pagination-row">
          <span className="assignment-pagination-text">
            {filtered.length === 0 ? '0' : `${start + 1}-${Math.min(start + pageSize, filtered.length)}`} of {filtered.length} items
          </span>
          <div className="assignment-pagination-btns">
            <button type="button" className="assignment-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className="students-page-number">{page}</span>
            <button type="button" className="assignment-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <select
              className="students-page-size-select"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
        </div>
      </div>

      <FiltersPopup show={showFilters} onClose={() => setShowFilters(false)} onApply={(f) => { setAppliedFilters(f); setPage(1) }} />

      {statusTarget && (
        <ChangeStatusPopup student={statusTarget} onClose={() => setStatusTarget(null)} onSave={handleStatusSave} />
      )}

      {paymentsTarget && (
        <PaymentsPopup student={paymentsTarget} onClose={() => setPaymentsTarget(null)} />
      )}

      {downloadNote && (
        <div className="generic-popup-overlay">
          <div className="generic-popup-card">
            <div className="generic-popup-icon-wrap">
              <FontAwesomeIcon icon={faDownload} className="generic-popup-icon" />
            </div>
            <h3 className="generic-popup-title">{downloadNote === 'export' ? 'Export Started' : 'Preparing Download'}</h3>
            <p className="generic-popup-text">
              {downloadNote === 'export'
                ? "Your Excel/CSV export is being prepared. This is a frontend demo, so no real file is generated yet — once the backend is connected, it'll download automatically."
                : "This student's record is being prepared as a download. This is a frontend demo, so no real file is generated yet."}
            </p>
            <button className="generic-popup-btn" onClick={() => setDownloadNote(null)}>Okay</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students
