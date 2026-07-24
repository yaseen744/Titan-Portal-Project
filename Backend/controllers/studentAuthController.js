import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'
import Course from '../models/Course.js'
import Batch from '../models/Batch.js'

// Login: only works if account has already been "activated" via Create Account
export async function loginStudent(req, res) {
  const { cnic, password } = req.body
  if (!cnic || !password) return res.status(400).json({ message: 'CNIC and password required' })

  const student = await Student.findOne({ cnic })
  if (!student || !student.accountActivated) {
    return res.status(401).json({ message: 'Account not found or not activated yet' })
  }
  if (student.password !== password) {
    return res.status(401).json({ message: 'Incorrect password' })
  }

  const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
  res.json({ token, student: sanitize(student) })
}

// Create Account:
// - If a sub-admin already pre-registered this CNIC, this activates that record (original flow).
// - If the CNIC doesn't exist yet, a new student record is created on the fly with placeholder
//   course/batch/roll number, so registration works standalone before the Sub-Admin panel exists.
//   Once a Sub-Admin panel is built, it can properly enroll/update these self-registered students
//   (assign the real course, batch, roll number, etc.).
export async function createStudentAccount(req, res) {
  const { cnic, password, email, name, dob } = req.body
  if (!cnic || !password) return res.status(400).json({ message: 'CNIC and password required' })

  let student = await Student.findOne({ cnic })

  if (student) {
    if (student.accountActivated) {
      return res.status(400).json({ message: 'Account already exists, please login instead.' })
    }
    student.password = password
    if (email) student.email = email
    if (name) student.name = name
    if (dob) student.dob = dob
    student.accountActivated = true
    await student.save()
  } else {
    // Brand new self-registration - no sub-admin has added this CNIC yet.
    // Fall back to a placeholder course/batch so registration doesn't get blocked.
    let course = await Course.findOne()
    if (!course) course = await Course.create({ name: 'Unassigned' })

    let batch = await Batch.findOne({ course: course._id })
    if (!batch) {
      batch = await Batch.create({ course: course._id, batchNumber: 'Unassigned', city: 'Not Set' })
    }

    const studentCount = await Student.countDocuments()
    const rollNumber = `STU-${String(studentCount + 1).padStart(4, '0')}`

    student = await Student.create({
      cnic,
      password,
      email: email || '',
      name: name || 'New Student',
      dob: dob || '',
      course: course._id,
      batch: batch._id,
      city: 'Not Set',
      rollNumber,
      accountActivated: true,
    })
  }

  const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
  res.json({ token, student: sanitize(student) })
}

function sanitize(student) {
  const obj = student.toObject()
  delete obj.password
  return obj
}