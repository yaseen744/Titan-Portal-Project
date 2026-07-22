import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen, faCircleCheck, faCircleXmark, faChevronDown,
  faSquareCheck, faClock,
} from '@fortawesome/free-solid-svg-icons'
import StudentTopbar from '../Layout/StudentTopbar.jsx'
import { formatDate } from '../../Media/dateUtils.js'
import api from '../../../api/axios.js'

// Converts a raw Progress document (populated with its Module) into the
// exact shape the UI already expects (same field names as the old dummy data).
function mapProgressDoc(doc) {
  const moduleTopics = doc.module?.topics || []
  const topicStatusById = {}
  for (const t of doc.topics || []) {
    topicStatusById[t.topic] = t
  }

  const topics = moduleTopics.map((mt) => {
    const status = topicStatusById[mt._id]
    return {
      name: mt.name,
      completed: !!status?.completed,
      date: status?.completedDate ? formatDate(new Date(status.completedDate)) : '',
    }
  })

  const completedTopics = topics.filter((t) => t.completed).length
  const totalTopics = topics.length
  const percent = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0

  return {
    title: doc.module?.title || 'Module',
    completedTopics,
    totalTopics,
    percent,
    topics,
  }
}

function Progress() {
  const { openFeedback } = useOutletContext()
  const [openModules, setOpenModules] = useState({})
  const [progressModules, setProgressModules] = useState([])

  useEffect(() => {
    api.get('/student/progress')
      .then(({ data }) => setProgressModules((data.progress || []).map(mapProgressDoc)))
      .catch((err) => console.error('Could not load progress data', err))
  }, [])

  const totalTopicsOverall = progressModules.reduce((sum, m) => sum + m.totalTopics, 0)
  const totalCompletedOverall = progressModules.reduce((sum, m) => sum + m.completedTopics, 0)
  const totalNotCompletedOverall = totalTopicsOverall - totalCompletedOverall

  const toggleModule = (title) => {
    setOpenModules((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="student-page">
      <StudentTopbar breadcrumb={['Home', 'WMA', 'Progress']} onFeedbackClick={openFeedback} />

      <div className="progress-stat-row">
        <div className="progress-stat-box">
          <FontAwesomeIcon icon={faBookOpen} className="progress-stat-icon" />
          <span className="progress-stat-value">{totalTopicsOverall}</span>
          <span className="progress-stat-label">Total Topics</span>
        </div>
        <div className="progress-stat-box">
          <FontAwesomeIcon icon={faCircleCheck} className="progress-stat-icon" />
          <span className="progress-stat-value">{totalCompletedOverall}</span>
          <span className="progress-stat-label">Total Completed</span>
        </div>
        <div className="progress-stat-box">
          <FontAwesomeIcon icon={faCircleXmark} className="progress-stat-icon" />
          <span className="progress-stat-value">{totalNotCompletedOverall}</span>
          <span className="progress-stat-label">Not Completed</span>
        </div>
      </div>

      {progressModules.map((mod) => {
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
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`progress-module-arrow ${isOpen ? 'progress-module-arrow-open' : ''}`}
                />
              </span>
            </button>

            {isOpen && (
              <div className="progress-module-body">
                <p className="progress-module-body-heading">Topics in {mod.title}:</p>
                {mod.topics.map((t) => (
                  <div key={t.name} className="progress-topic-row">
                    <span className="progress-topic-name">
                      {t.completed && <FontAwesomeIcon icon={faSquareCheck} className="progress-topic-tick" />}
                      {t.name}
                    </span>
                    {t.date && <span className="progress-topic-date">{t.date}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Progress
