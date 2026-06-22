import './TeacherPageHeader.css'

// crumbs: array of strings, e.g. ['Dashboard'] or ['Dashboard', 'Attendance']
function TeacherPageHeader({ crumbs }) {
  return (
    <div className="teacherPageHeader">
      {crumbs.map((crumb, index) => (
        <span key={crumb} className="teacherPageHeaderCrumbWrapper">
          <span
            className={
              index === crumbs.length - 1
                ? 'teacherPageHeaderCrumb teacherPageHeaderCrumbActive'
                : 'teacherPageHeaderCrumb'
            }
          >
            {crumb}
          </span>
          {index < crumbs.length - 1 && (
            <i className="fa-solid fa-chevron-right teacherPageHeaderSeparator"></i>
          )}
        </span>
      ))}
    </div>
  )
}

export default TeacherPageHeader
