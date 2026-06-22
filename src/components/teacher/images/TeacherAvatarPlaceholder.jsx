// Generic placeholder avatar for the teacher's profile picture.
// Swap for a real uploaded photo later — kept as an inline SVG so
// there's no dependency on an external image file for now.
function TeacherAvatarPlaceholder({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Teacher profile picture"
    >
      <circle cx="20" cy="20" r="20" fill="#dbe6fb" />
      <circle cx="20" cy="16" r="7" fill="#142247" />
      <path
        d="M6 36c1.5-8 7.5-12 14-12s12.5 4 14 12"
        fill="#142247"
      />
    </svg>
  )
}

export default TeacherAvatarPlaceholder
