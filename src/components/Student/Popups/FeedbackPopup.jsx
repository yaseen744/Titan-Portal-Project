import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBug, faLightbulb, faCommentDots, faXmark, faImage,
  faPaperPlane, faCircleCheck,
} from '@fortawesome/free-solid-svg-icons'

const feedbackTypes = [
  { id: 'bug', label: 'Bug', icon: faBug },
  { id: 'idea', label: 'Idea', icon: faLightbulb },
  { id: 'other', label: 'Other', icon: faCommentDots },
]

// step: 'form' -> 'confirm' -> 'thanks'
function FeedbackPopup({ show, onClose }) {
  const [step, setStep] = useState('form')
  const [type, setType] = useState('bug')
  const [text, setText] = useState('')
  const [images, setImages] = useState([])

  if (!show) return null

  const handleClose = () => {
    setStep('form')
    setType('bug')
    setText('')
    setImages([])
    onClose()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    setImages(files.map((f) => f.name))
  }

  const canSend = text.trim().length > 0

  return (
    <div className="generic-popup-overlay">
      {step === 'form' && (
        <div className="feedback-popup-card">
          <button className="generic-popup-close" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h3 className="feedback-popup-title">Share Your Feedback</h3>
          <p className="feedback-popup-subtext">
            Let us know if we could do anything to improve your learning experience. Your input
            genuinely helps us make the course better for everyone.
          </p>

          <p className="feedback-popup-label">Select Type</p>
          <div className="feedback-type-row">
            {feedbackTypes.map((ft) => (
              <button
                key={ft.id}
                type="button"
                className={`feedback-type-btn ${type === ft.id ? 'feedback-type-btn-active' : ''}`}
                onClick={() => setType(ft.id)}
              >
                <FontAwesomeIcon icon={ft.icon} /> {ft.label}
              </button>
            ))}
          </div>

          <textarea
            className="feedback-textarea"
            placeholder="Your Feedback"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <p className="feedback-popup-label">Reference Images</p>
          <div className="feedback-file-row">
            <span className="feedback-file-name">
              {images.length > 0 ? images.join(', ') : 'No file chosen'}
            </span>
            <label className="feedback-add-image-btn">
              <FontAwesomeIcon icon={faImage} /> +Add Image
              <input type="file" multiple accept="image/*" hidden onChange={handleFileChange} />
            </label>
          </div>

          <button
            type="button"
            className="feedback-send-btn"
            disabled={!canSend}
            onClick={() => canSend && setStep('confirm')}
          >
            <FontAwesomeIcon icon={faPaperPlane} /> Send Feedback
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="generic-popup-card">
          <h3 className="generic-popup-title">Confirm Your Feedback</h3>
          <p className="feedback-confirm-line">
            <strong>Type:</strong> {feedbackTypes.find((f) => f.id === type)?.label}
          </p>
          <p className="feedback-confirm-line"><strong>Message:</strong> {text}</p>
          <p className="feedback-confirm-line">
            <strong>Images:</strong> {images.length > 0 ? images.join(', ') : 'None'}
          </p>
          <div className="feedback-confirm-btn-row">
            <button className="generic-popup-btn-outline" onClick={() => setStep('form')}>
              Back
            </button>
            <button className="generic-popup-btn" onClick={() => setStep('thanks')}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {step === 'thanks' && (
        <div className="generic-popup-card">
          <div className="generic-popup-icon-wrap">
            <FontAwesomeIcon icon={faCircleCheck} className="generic-popup-icon" />
          </div>
          <h3 className="generic-popup-title">Thank You!</h3>
          <p className="generic-popup-text">
            Your feedback means a lot to us. We'll review it and use it to make your learning
            experience even better.
          </p>
          <button className="generic-popup-btn" onClick={handleClose}>
            Back to Page
          </button>
        </div>
      )}
    </div>
  )
}

export default FeedbackPopup
