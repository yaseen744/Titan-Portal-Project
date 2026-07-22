import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faMoneyBillWave, faPlus } from '@fortawesome/free-solid-svg-icons'

function statusClass(status) {
  if (status === 'Paid') return 'fee-status-paid'
  if (status === 'Pending') return 'voucher-status-pending'
  return 'voucher-status-none'
}

function PaymentsPopup({ student, onClose }) {
  const [vouchers, setVouchers] = useState(student?.vouchers || [])
  const [generated, setGenerated] = useState(false)

  if (!student) return null

  const handleGenerate = () => {
    const newVoucher = {
      invoiceNo: `INV-${3000 + vouchers.length}`,
      paymentId: `PAY-${4000 + vouchers.length}`,
      type: 'Monthly',
      month: 'July 2026',
      dueDate: '08-Jul-2026',
      amount: 'Rs: 1000/-',
      status: 'Pending',
    }
    setVouchers([newVoucher, ...vouchers])
    setGenerated(true)
    setTimeout(() => setGenerated(false), 2500)
  }

  return (
    <div className="generic-popup-overlay">
      <div className="submissions-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faMoneyBillWave} /> Fees &amp; Vouchers — {student.name}
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {generated && (
          <p className="voucher-generated-note">A new monthly voucher has been created with status "Pending".</p>
        )}

        <div className="voucher-table">
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
        </div>

        <p className="voucher-note">
          Note: students pay outside the system (e.g. through JazzCash). This panel only records
          the voucher and whether it has been paid.
        </p>

        <div className="feedback-confirm-btn-row">
          <button className="generic-popup-btn-outline" onClick={onClose}>Close</button>
          <button className="generic-popup-btn" onClick={handleGenerate}>
            <FontAwesomeIcon icon={faPlus} /> Generate Monthly Voucher
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentsPopup
