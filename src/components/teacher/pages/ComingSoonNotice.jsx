import './ComingSoonNotice.css'

function ComingSoonNotice({ icon, title, text }) {
  return (
    <div className="comingSoonNotice">
      <div className="comingSoonNoticeIcon">
        <i className={icon}></i>
      </div>
      <h3 className="comingSoonNoticeTitle">{title}</h3>
      <p className="comingSoonNoticeText">{text}</p>
    </div>
  )
}

export default ComingSoonNotice
