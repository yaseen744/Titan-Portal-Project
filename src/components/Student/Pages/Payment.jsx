import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMobileScreenButton, faPlay, faArrowsRotate, faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons'
import StudentTopbar from '../Layout/StudentTopbar.jsx'
import { payments } from '../data/studentData.js'

const jazzCashSteps = [
  'Open JazzCash app',
  'Click on More',
  'Go to Education tab',
  'Click Universities',
  'Select Saylani Education from the list',
  'Paste your Voucher ID',
  'Pay your fee',
]

function Payment() {
  const { openFeedback } = useOutletContext()
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [showRefreshPopup, setShowRefreshPopup] = useState(false)

  return (
    <div className="student-page">
      <StudentTopbar breadcrumb={['Home', 'WMA', 'Payment']} onFeedbackClick={openFeedback} />

      <div className="payment-instructions-box">
        <div className="payment-instructions-text">
          <h4 className="payment-instructions-heading">To pay your fee via JazzCash:</h4>
          <ol className="payment-instructions-list">
            {jazzCashSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="payment-video-phone">
          {!videoPlaying ? (
            <button type="button" className="payment-video-play-btn" onClick={() => setVideoPlaying(true)}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
          ) : (
            <p className="payment-video-placeholder-text">
              <FontAwesomeIcon icon={faMobileScreenButton} /><br />
              Add your JazzCash tutorial video link here
            </p>
          )}
        </div>
      </div>

      <div className="payment-refresh-row">
        <button type="button" className="payment-refresh-btn" onClick={() => setShowRefreshPopup(true)}>
          <FontAwesomeIcon icon={faArrowsRotate} /> Refresh
        </button>
      </div>

      <div className="fee-history-box">
        <div className="fee-challan-header fee-challan-header-wide">
          <span>Month</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Due Date</span>
          <span>Voucher ID</span>
          <span>Status</span>
        </div>
        {payments.map((p) => (
          <div key={p.month} className="fee-challan-row fee-challan-header-wide">
            <span>{p.month}</span>
            <span>{p.amount}</span>
            <span>{p.type}</span>
            <span>{p.dueDate}</span>
            <span>{p.voucherId}</span>
            <span className="fee-status-paid">{p.status}</span>
          </div>
        ))}
      </div>

      {showRefreshPopup && (
        <div className="generic-popup-overlay">
          <div className="generic-popup-card">
            <div className="generic-popup-icon-wrap">
              <FontAwesomeIcon icon={faMoneyBillWave} className="generic-popup-icon" />
            </div>
            <h3 className="generic-popup-title">Fee Status Refreshed</h3>
            <p className="generic-popup-text">
              Your fee records are already up to date. Once the database is connected, this will
              pull your latest payment status live from JazzCash.
            </p>
            <button className="generic-popup-btn" onClick={() => setShowRefreshPopup(false)}>
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment
