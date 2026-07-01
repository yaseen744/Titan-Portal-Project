import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faSquareCheck, faClock, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { getCourseProgressModules, teacherInfo } from '../data/teacherData.js'
import CompareProgressPopup from '../Popups/CompareProgressPopup.jsx'

function CourseProgressTab({ course }) {
  const modules = useMemo(() => getCourseProgressModules(course), [course])
  const [openModules, setOpenModules] = useState({})
  const [showCompare, setShowCompare] = useState(false)

  const totalTopics = modules.reduce((s, m) => s + m.totalTopics, 0)
  const totalCompleted = modules.reduce((s, m) => s + m.completedTopics, 0)
  const overallPercent = Math.round((totalCompleted / totalTopics) * 100)

  const toggleModule = (title) => setOpenModules((prev) => ({ ...prev, [title]: !prev[title] }))

  return (
    <div className="course-tab-box">
      <div className="compare-progress-header-row">
        <div>
          <p className="compare-progress-small-label">Compare Progress</p>
          <h4 className="course-tab-heading">Course Progress Overview</h4>
        </div>
        <button type="button" className="course-tab-new-btn" onClick={() => setShowCompare(true)}>
          <FontAwesomeIcon icon={faChartLine} /> Show Comparison
        </button>
      </div>

      <div className="my-progress-box">
        <p className="my-progress-label">My Progress</p>
        <div className="my-progress-top-row">
          <span className="my-progress-name">
            {teacherInfo.name} - {course.campus}
          </span>
          <span className="my-progress-batch-badge">{course.batchLabel}</span>
          <span className="my-progress-topics">{totalCompleted}/{totalTopics}</span>
        </div>
        <div className="course-card-progress-track">
          <div className="course-card-progress-fill" style={{ width: `${overallPercent}%` }}></div>
        </div>
      </div>

      {modules.map((mod) => {
        const isFullyDone = mod.completedTopics === mod.totalTopics
        const isOpen = !!openModules[mod.title]
        return (
          <div key={mod.title} className="progress-module-box">
            <button type="button" className="progress-module-header" onClick={() => toggleModule(mod.title)}>
              <span className="progress-module-title">
                <FontAwesomeIcon
                  icon={isFullyDone ? faSquareCheck : faClock}
                  className={isFullyDone ? 'progress-module-tick-done' : 'progress-module-tick-pending'}
                />
                {mod.title}
                <span className="progress-module-topics-count">
                  Topics: {mod.completedTopics}/{mod.totalTopics}
                </span>
              </span>
              <span className="progress-module-right">
                <span className="progress-module-percent-circle">{mod.percent}%</span>
                <FontAwesomeIcon icon={faChevronDown} className={`progress-module-arrow ${isOpen ? 'progress-module-arrow-open' : ''}`} />
              </span>
            </button>
            {isOpen && (
              <div className="progress-module-body">
                <p className="progress-module-body-heading">
                  This module is {mod.percent}% covered for this batch so far.
                </p>
              </div>
            )}
          </div>
        )
      })}

      <CompareProgressPopup show={showCompare} onClose={() => setShowCompare(false)} />
    </div>
  )
}

export default CourseProgressTab
