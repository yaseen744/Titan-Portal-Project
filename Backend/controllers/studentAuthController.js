import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'

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

// Create Account: only allowed if sub-admin has already added this CNIC as a student
export async function createStudentAccount(req, res) {
  const { cnic, password, email, name } = req.body
  if (!cnic || !password) return res.status(400).json({ message: 'CNIC and password required' })

  const student = await Student.findOne({ cnic })
  if (!student) {
    return res.status(404).json({
      message: 'This CNIC has not been registered by any campus yet. Ask your sub-admin to add you first.',
    })
  }
  if (student.accountActivated) {
    return res.status(400).json({ message: 'Account already exists, please login instead.' })
  }

  student.password = password
  if (email) student.email = email
  if (name) student.name = name
  student.accountActivated = true
  await student.save()

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