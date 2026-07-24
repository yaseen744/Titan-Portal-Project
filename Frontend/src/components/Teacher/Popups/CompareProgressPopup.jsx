import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faChartLine } from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/axios.js'

function CompareProgressPopup({ show, course, onClose }) {
  const [comparison, setComparison] = useState([])

  useEffect(() => {
    if (!show) return
    api.get('/teacher/progress/comparison', { params: { batchId: course.batchId } })
      .then(({ data }) => setComparison(data.comparison || []))
      .catch((err) => console.error('Could not load comparison', err))
  }, [show, course])

  if (!show) return null

  return (
    <div className="generic-popup-overlay">
      <div className="compare-progress-card">
        <div className="assignment-view-top">
          <span className="assignment-view-top-heading">
            <FontAwesomeIcon icon={faChartLine} /> Other Batches of {course.title}
          </span>
          <button className="generic-popup-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {comparison.length === 0 && (
          <p className="compare-progress-slot" style={{ padding: '20px 4px' }}>
            No other batches of this course exist yet.
          </p>
        )}

        <div className="compare-progress-row">
          {comparison.map((t, idx) => {
            const percent = t.totalTopics ? Math.round((t.totalCoveredTopics / t.totalTopics) * 100) : 0
            return (
              <div key={idx} className="compare-progress-box">
                <div className="compare-progress-box-top">
                  <span className="compare-progress-name">{t.teacherName}</span>
                  <span className="compare-progress-percent">{percent}%</span>
                </div>
                <p className="compare-progress-slot">
                  {t.campus} — {(t.days || []).join(', ')} {t.time}
                </p>
                <p className="compare-progress-covered-label">Covered Topics</p>
                <div className="compare-progress-covered-row">
                  <span>{t.totalCoveredTopics}/{t.totalTopics}</span>
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
