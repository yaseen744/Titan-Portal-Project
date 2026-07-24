// Handles saving/reading the logged-in student's session (token + profile)
// in localStorage, so a page refresh doesn't log the student out.

const KEY = 'titan_student_session'
const TEACHER_KEY = 'titan_teacher_session'

export function saveSession(token, student) {
  localStorage.setItem(KEY, JSON.stringify({ token, student }))
}

export function getSession() {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : null
}

export function getToken() {
  return getSession()?.token || null
}

// ---------------- Teacher session (separate from student) ----------------
export function saveTeacherSession(token, teacher) {
  localStorage.setItem(TEACHER_KEY, JSON.stringify({ token, teacher }))
}

export function getTeacherSession() {
  const raw = localStorage.getItem(TEACHER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function getTeacherToken() {
  return getTeacherSession()?.token || null
}

export function getTeacher() {
  return getTeacherSession()?.teacher || null
}

export function updateTeacherFields(partial) {
  const session = getTeacherSession()
  if (!session) return
  const merged = { ...session.teacher, ...partial }
  saveTeacherSession(session.token, merged)
}

export function clearTeacherSession() {
  localStorage.removeItem(TEACHER_KEY)
}

export function isTeacherLoggedIn() {
  return !!getTeacherToken()
}

export function getStudent() {
  return getSession()?.student || null
}

// Merge partial fields into the stored student (used after profile edits)
// without losing populated fields (course name, batch number) that the
// update endpoint itself doesn't return.
export function updateStudentFields(partial) {
  const session = getSession()
  if (!session) return
  const merged = { ...session.student, ...partial }
  saveSession(session.token, merged)
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

// Adapts whatever shape the backend student object is in (populated or not)
// into the exact field names the UI already expects (same as the old dummy
// studentData.js `studentInfo` shape), so page components don't need to change.
export function getStudentInfo() {
  const student = getStudent()
  if (!student) return null

  return {
    name: student.name || '',
    rollNo: student.rollNumber || '',
    batch: student.batch?.batchNumber || student.batch || '',
    campus: student.campus || '',
    city: student.city || '',
    course: student.course?.name || student.course || '',
    email: student.email || '',
    phone: student.phone || '',
    gender: student.gender || '',
    dob: student.dob || '',
    cnic: student.cnic || '',
    qualification: student.qualification || 'Not provided',
    address: student.address || '',
    photo: student.profilePic || '',
  }
}
