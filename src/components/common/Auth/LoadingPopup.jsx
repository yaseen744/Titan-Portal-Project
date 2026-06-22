import { useEffect, useState } from 'react'
import './LoadingPopup.css'

// Shown for ~5s right after a login submit, then calls onFinish().
// Used by both the student and teacher login forms.
function LoadingPopup({ onFinish }) {
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
    <div className="loadingPopupOverlay">
      <div className="loadingPopupCard">
        <div className="loadingPopupSpinner"></div>
        <p className="loadingPopupText">Please wait...</p>
        <div className="loadingPopupProgressTrack">
          <div
            className="loadingPopupProgressFill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingPopup
