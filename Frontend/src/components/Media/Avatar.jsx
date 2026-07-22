import { useState } from 'react'

// A robust avatar: tries to show a real photo if a photoUrl is given, but
// automatically falls back to a clean initials circle if that photo fails
// to load (no internet, blocked domain, broken link, etc.) - so the UI
// never shows a broken-image icon.

const palette = ['avatar-bg-navy', 'avatar-bg-gold', 'avatar-bg-blue', 'avatar-bg-green']

function getInitials(name) {
  if (!name) return '?'
  const cleaned = name.replace(/\([^)]*\)/g, '').trim()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getColorClass(name) {
  let sum = 0
  const str = name || ''
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i)
  return palette[sum % palette.length]
}

function Avatar({ name, photoUrl, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (photoUrl && !imgFailed) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={className}
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <div className={`avatar-initials ${getColorClass(name)} ${className}`}>
      {getInitials(name)}
    </div>
  )
}

export default Avatar
