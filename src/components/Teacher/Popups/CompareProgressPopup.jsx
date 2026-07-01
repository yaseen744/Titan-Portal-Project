import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { otherTeachersForCompare } from '../data/teacherData.js'

function CompareProgressPopup({ show, onClose }) {
  if (!show) return null

  return (
    <div className="generic-popup-overlay">
      <div className="compare-progress-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faChartLine} /> Other Slots of Batch-1
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="compare-progress-row">
          {otherTeachersForCompare.map((t) => {
            const percent = Math.round((t.covered / t.total) * 100)
            return (
              <div key={t.name} className="compare-progress-box">
                <div className="compare-progress-box-top">
                  <span className="compare-progress-name">{t.name}</span>
                  <span className="compare-progress-percent">{percent}%</span>
                </div>
                <p className="compare-progress-slot">{t.slot}</p>
                <p className="compare-progress-covered-label">Covered Topics</p>
                <div className="compare-progress-covered-row">
                  <span>{t.covered}/{t.total}</span>
                </div>
                <div className="course-card-progress-track">
                  <div className="course-card-progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="assignment-view-footer">
          <button type="button" className="generic-popup-btn" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompareProgressPopup
