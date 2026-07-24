import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faSquareCheck, faClock, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { getTeacher } from '../../../api/session.js'
import CompareProgressPopup from '../Popups/CompareProgressPopup.jsx'
import api from '../../../api/axios.js'

function CourseProgressTab({ course }) {
  const teacherInfo = getTeacher() || { name: '' }
  const [modules, setModules] = useState([])
  const [openModules, setOpenModules] = useState({})
  const [showCompare, setShowCompare] = useState(false)

  const loadProgress = () => {
    api.get('/teacher/progress', { params: { batchId: course.batchId } })
      .then(({ data }) => {
        setModules(
          (data.modules || []).map((m) => {
            const completedTopics = m.topics.filter((t) => t.completed).length
            const totalTopics = m.topics.length
            return {
              moduleId: m.moduleId,
              title: m.title,
              topics: m.topics,
              completedTopics,
              totalTopics,
              percent: totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0,
            }
          })
        )
      })
      .catch((err) => console.error('Could not load progress', err))
  }

  useEffect(() => {
    loadProgress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.batchId])

  const totalTopics = modules.reduce((s, m) => s + m.totalTopics, 0)
  const totalCompleted = modules.reduce((s, m) => s + m.completedTopics, 0)
  const overallPercent = totalTopics ? Math.round((totalCompleted / totalTopics) * 100) : 0

  const toggleModule = (title) => setOpenModules((prev) => ({ ...prev, [title]: !prev[title] }))

  const handleToggleTopic = async (moduleId, topicId, currentlyCompleted) => {
    try {
      await api.put('/teacher/progress', {
        batchId: course.batchId,
        moduleId,
        topicId,
        completed: !currentlyCompleted,
      })
      loadProgress()
    } catch (err) {
      console.error('Could not update topic progress', err)
    }
  }

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
        const isFullyDone = mod.completedTopics === mod.totalTopics && mod.totalTopics > 0
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
                {mod.topics.map((t) => (
                  <div
                    key={t.topicId}
                    className="student-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleTopic(mod.moduleId, t.topicId, t.completed)}
                  >
                    <span className="student-row-name">
                      <FontAwesomeIcon
                        icon={t.completed ? faSquareCheck : faClock}
                        className={t.completed ? 'progress-module-tick-done' : 'progress-module-tick-pending'}
                        style={{ marginRight: 8 }}
                      />
                      {t.name}
                    </span>
                    <span>
                      {t.completed && t.completedDate ? new Date(t.completedDate).toLocaleDateString() : 'Not done yet'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <CompareProgressPopup show={showCompare} course={course} onClose={() => setShowCompare(false)} />
    </div>
  )
}

export default CourseProgressTab
