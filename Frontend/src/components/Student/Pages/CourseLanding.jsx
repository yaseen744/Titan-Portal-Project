import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faChevronDown, faCommentDots,
} from '@fortawesome/free-solid-svg-icons'
import titanLogo from '../../Media/images/titan-logo.png'
import WaitingPopup from '../../Media/WaitingPopup.jsx'
import FeedbackPopup from '../Popups/FeedbackPopup.jsx'
import CourseSummaryCard from './CourseSummaryCard.jsx'

function CourseLanding() {
  const navigate = useNavigate()
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState('Enrolled')
  const [showFeedback, setShowFeedback] = useState(false)
  const [connecting, setConnecting] = useState(false)

  return (
    <div className="course-landing-page">
      <div className="course-landing-topbar">
        <img src={titanLogo} alt="Titan" className="course-landing-logo" />

        <div className="course-landing-search-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="course-landing-search-icon" />
          <input type="text" className="course-landing-search-input" placeholder="Search courses..." />
        </div>

        <div className="course-landing-filter-wrap">
          <button
            type="button"
            className="course-landing-filter-btn"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filter} <FontAwesomeIcon icon={faChevronDown} />
          </button>
          {filterOpen && (
            <div className="course-landing-filter-menu">
              {['Enrolled', 'All'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="course-landing-filter-item"
                  onClick={() => {
                    setFilter(opt)
                    setFilterOpen(false)
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" className="course-landing-feedback-btn" onClick={() => setShowFeedback(true)}>
          <FontAwesomeIcon icon={faCommentDots} /> Feedback
        </button>
      </div>

      <div className="course-landing-body">
        <CourseSummaryCard onViewDetail={() => setConnecting(true)} />
      </div>

      <FeedbackPopup show={showFeedback} onClose={() => setShowFeedback(false)} />

      <WaitingPopup
        show={connecting}
        label="Connecting to more detail..."
        durationMs={2000}
        onComplete={() => navigate('/student/dashboard')}
      />
    </div>
  )
}

export default CourseLanding
