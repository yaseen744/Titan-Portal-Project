import { useEffect, useState } from 'react'
import './LogoutPopup.css'

function LogoutPopup({ onFinish }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDurationMs = 5000
    const stepMs = 50
    const stepAmount = (stepMs / totalDurationMs) * 100

    const interval = setInterval(() => {
      setProgress((current) => {
        const next = current + stepAmount
        if (next >= 100) {
          clearInterval(interval)
          return 100
        }
        return next
      })
    }, stepMs)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onFinish()
      }, 250)
      return () => clearTimeout(timeout)
    }
  }, [progress, onFinish])

  return (
    <div className="logoutPopupOverlay">
      <div className="logoutPopupCard">
        <div className="logoutPopupSpinner"></div>
        <p className="logoutPopupText">Logging out...</p>
        <div className="logoutPopupProgressTrack">
          <div className="logoutPopupProgressFill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  )
}

export default LogoutPopup
