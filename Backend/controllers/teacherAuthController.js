import jwt from 'jsonwebtoken'
import Teacher from '../models/Teacher.js'

export async function loginTeacher(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

  const teacher = await Teacher.findOne({ email: email.toLowerCase().trim() })
  if (!teacher) return res.status(401).json({ message: 'Invalid email or password' })
  if (teacher.status === 'suspended') {
    return res.status(403).json({ message: 'You have been suspended. Contact your admin.' })
  }
  if (teacher.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
  res.json({ token, teacher: sanitize(teacher) })
}

export function sanitize(teacher) {
  const obj = teacher.toObject()
  delete obj.password
  return obj
}
