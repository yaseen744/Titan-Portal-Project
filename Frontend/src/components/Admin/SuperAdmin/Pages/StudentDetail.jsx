import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser, faGraduationCap, faAddressCard, faBriefcase, faBookOpen, faClockRotateLeft,
  faFilePdf, faPenToSquare, faMoneyBillWave, faPlus, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import SuperAdminTopbar from '../Layout/SuperAdminTopbar.jsx'
import Avatar from '../../../Media/Avatar.jsx'
import EditStudentPopup from '../Popups/EditStudentPopup.jsx'
import { students as initialStudents, hasPermission } from '../data/superAdminData.js'

const tabs = [
  { id: 'personal', label: 'Personal', icon: faUser },
  { id: 'education', label: 'Education', icon: faGraduationCap },
  { id: 'contact', label: 'Contact', icon: faAddressCard },
  { id: 'employment', label: 'Employment', icon: faBriefcase },
  { id: 'courses', label: 'Courses', icon: faBookOpen },
]

function statusClass(status) {
  if (status === 'Paid') return 'fee-status-paid'
  if (status === 'Pending') return 'voucher-status-pending'
  return 'voucher-status-none'
}

function StudentDetail() {
  const { studentId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [allStudents, setAllStudents] = useState(initialStudents)
  const student = allStudents.find((s) => s.id === studentId)
  const [activeTab, setActiveTab] = useState('personal')
  const [showEdit, setShowEdit] = useState(!!location.state?.openEdit)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [vouchers, setVouchers] = useState(student?.vouchers || [])

  if (!student) {
    return (
      <div className="superadmin-page">
        <SuperAdminTopbar breadcrumb={['Home', 'Students', 'Not Found']} />
        <p>Student not found.</p>
        <button type="button" className="auth-btn-secondary" onClick={() => navigate('/admin/superadmin/students')} style={{ maxWidth: 220 }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Students
        </button>
      </div>
    )
  }

  const handleSaveEdit = (form) => {
    setAllStudents(allStudents.map((s) => (s.id === student.id ? { ...s, ...form } : s)))
  }

  const handleGenerateVoucher = () => {
    setVouchers([
      { invoiceNo: `INV-${3000 + vouchers.length}`, paymentId: `PAY-${4000 + vouchers.length}`, type: 'Monthly', month: 'July 2026', dueDate: '08-Jul-2026', amount: 'Rs: 1000/-', status: 'Pending' },
      ...vouchers,
    ])
  }

  return (
    <div className="superadmin-page">
      <SuperAdminTopbar breadcrumb={['Home', 'Students', student.name]} />

      <div className="student-detail-header">
        <Avatar name={student.name} className="student-detail-avatar" />
        <div className="student-detail-header-text">
          <h2 className="student-detail-name">{student.name}</h2>
          <p className="student-detail-roll">Roll: {student.roll} &nbsp;|&nbsp; {student.course} ({student.batch})</p>
        </div>
        <div className="student-detail-header-actions">
          {hasPermission('STUDENT', 'UPDATE') && (
            <button type="button" className="superadmin-toolbar-btn" onClick={() => setShowEdit(true)}>
              <FontAwesomeIcon icon={faPenToSquare} /> Edit
            </button>
          )}
          <button type="button" className="superadmin-toolbar-btn superadmin-toolbar-btn-primary" onClick={() => setGeneratingPdf(true)}>
            <FontAwesomeIcon icon={faFilePdf} /> Generate Audit PDF
          </button>
        </div>
      </div>

      <div className="course-detail-tab-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`course-detail-tab-btn ${activeTab === tab.id ? 'course-detail-tab-btn-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="course-tab-box">
        {activeTab === 'personal' && (
          <div className="student-detail-info-grid">
            <p><strong>Full Name:</strong> {student.name}</p>
            <p><strong>Father Name:</strong> {student.fatherName}</p>
            <p><strong>CNIC:</strong> {student.cnic}</p>
            <p><strong>Father's CNIC:</strong> {student.fatherCnic}</p>
            <p><strong>Date of Birth:</strong> {student.dob}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="student-detail-info-grid">
            <p><strong>Last Qualification:</strong> {student.lastQualification}</p>
            <p><strong>Computer Level:</strong> {student.computerLevel}</p>
            <p><strong>Has Laptop:</strong> {student.hasLaptop ? 'Yes' : 'No'}</p>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="student-detail-info-grid">
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Father's Phone:</strong> {student.fatherPhone}</p>
            <p><strong>Address:</strong> {student.address}</p>
            <p><strong>City:</strong> {student.city}</p>
            <p><strong>Campus:</strong> {student.campus}</p>
          </div>
        )}

        {activeTab === 'employment' && (
          <div className="student-detail-info-grid">
            <p><strong>Sponsorship:</strong> {student.sponsorship}</p>
            <p className="student-detail-empty-note">No employment record provided.</p>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="voucher-table">
            <div className="voucher-table-head student-courses-head">
              <span>Course</span>
              <span>Batch</span>
              <span>Campus</span>
              <span>Schedule</span>
              <span>Status</span>
            </div>
            <div className="voucher-table-row student-courses-head">
              <span>{student.course}</span>
              <span>{student.batch}</span>
              <span>{student.campus}</span>
              <span>{student.slot}</span>
              <span className="student-status-chip student-status-good">{student.status}</span>
            </div>
          </div>
        )}
      </div>

      <h4 className="student-form-section-heading">
        <FontAwesomeIcon icon={faClockRotateLeft} /> History
      </h4>
      <div className="course-tab-box student-history-box">
        {student.history.map((h, idx) => (
          <p key={idx} className="student-history-line">
            <strong>{h.date}:</strong> {h.change} <span className="student-history-by">— by {h.by}</span>
          </p>
        ))}
      </div>

      <h4 className="student-form-section-heading">
        <FontAwesomeIcon icon={faMoneyBillWave} /> Fees &amp; Vouchers
      </h4>
      <div className="voucher-table course-tab-box">
        <div className="voucher-table-head">
          <span>Invoice #</span>
          <span>Payment ID</span>
          <span>Type</span>
          <span>Month</span>
          <span>Due Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {vouchers.map((v) => (
          <div key={v.invoiceNo} className="voucher-table-row">
            <span>{v.invoiceNo}</span>
            <span>{v.paymentId}</span>
            <span>{v.type}</span>
            <span>{v.month}</span>
            <span>{v.dueDate}</span>
            <span>{v.amount}</span>
            <span className={statusClass(v.status)}>{v.status}</span>
          </div>
        ))}
        <button type="button" className="course-tab-new-btn student-generate-voucher-btn" onClick={handleGenerateVoucher}>
          <FontAwesomeIcon icon={faPlus} /> Generate Monthly Voucher
        </button>
      </div>

      {showEdit && <EditStudentPopup student={student} onClose={() => setShowEdit(false)} onSave={handleSaveEdit} />}

      {generatingPdf && (
        <div className="generic-popup-overlay">
          <div className="generic-popup-card">
            <div className="generic-popup-icon-wrap">
              <FontAwesomeIcon icon={faFilePdf} className="generic-popup-icon" />
            </div>
            <h3 className="generic-popup-title">Generating Audit PDF</h3>
            <p className="generic-popup-text">
              A full printable record for {student.name} is being prepared. This is a frontend
              demo, so no real PDF is generated yet — once the backend is connected, it'll
              download automatically.
            </p>
            <button className="generic-popup-btn" onClick={() => setGeneratingPdf(false)}>Okay</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDetail
