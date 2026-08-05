import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

// items: [{ label, icon, danger?, onClick }]
function RowMenu({ items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="row-menu-wrap" ref={ref}>
      <button type="button" className="row-menu-trigger" onClick={() => setOpen(!open)} aria-label="More actions">
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>
      {open && (
        <div className="row-menu-dropdown">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`row-menu-item ${item.danger ? 'row-menu-item-danger' : ''}`}
              onClick={() => { setOpen(false); item.onClick() }}
            >
              <FontAwesomeIcon icon={item.icon} /> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default RowMenu
