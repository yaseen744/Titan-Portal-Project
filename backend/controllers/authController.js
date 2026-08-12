import bcrypt from 'bcryptjs'
import SuperAdmin from '../models/SuperAdmin.js'
import SubAdmin from '../models/SubAdmin.js'
import Teacher from '../models/Teacher.js'
import Student from '../models/Student.js'
import Otp from '../models/Otp.js'
import { generateToken } from '../utils/generateToken.js'
import { sendOtpWhatsApp } from '../utils/otpService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const modelByRole = {
  superadmin: SuperAdmin,
  subadmin: SubAdmin,
  teacher: Teacher,
  student: Student,
}

function sanitize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc
  delete obj.password
  return obj
}

function maskPhone(phone) {
  if (!phone || phone.length < 4) return '****'
  return `${'*'.repeat(Math.max(phone.length - 4, 0))}${phone.slice(-4)}`
}

// --- Login: Super Admin / Sub Admin / Teacher (email + password) ---
export const loginWithEmail = (role) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const Model = modelByRole[role]

    // Trainers (and only trainers, currently) can share an email/phone with
    // another account - Trainer ID is their real unique key, not email. So
    // instead of assuming one account per email, pull every account with
    // this email and let the password be the tie-breaker: each account's
    // password is still its own, so comparing against every candidate finds
    // the one actually being logged into, even when the email collides.
    const candidates = await Model.find({ email: email.toLowerCase().trim() })
    if (candidates.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    let account = null
    for (const candidate of candidates) {
      // eslint-disable-next-line no-await-in-loop
      if (await bcrypt.compare(password, candidate.password)) {
        account = candidate
        break
      }
    }
    if (!account) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    if (role !== 'superadmin' && account.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended. Contact your administrator.' })
    }

    const token = generateToken(account._id, role)
    res.json({ token, role, user: sanitize(account) })
  })

// --- Login: Student (CNIC + password) ---
export const loginStudent = asyncHandler(async (req, res) => {
  const { cnic, password } = req.body
  if (!cnic || !password) {
    return res.status(400).json({ message: 'CNIC and password are required.' })
  }

  const student = await Student.findOne({ cnic: cnic.trim() })
    .populate('campus', 'name city')
    .populate('course', 'name')
    .populate({ path: 'slot', populate: { path: 'teacher', select: 'name email' } })

  if (!student || !student.accountCreated) {
    return res.status(401).json({
      message: 'No active account found for this CNIC. Ask your Sub Admin to enroll you first, then create your account.',
    })
  }

  const match = await bcrypt.compare(password, student.password)
  if (!match) {
    return res.status(401).json({ message: 'Invalid CNIC or password.' })
  }

  if (student.accountBlocked) {
    return res.status(403).json({ message: student.blockedReason || 'Your account has been blocked.', code: 'BLOCKED' })
  }

  const token = generateToken(student._id, 'student')
  res.json({ token, role: 'student', user: sanitize(student) })
})

// --- Student self-activation: turns a Sub-Admin-created pre-registration into a login-able account ---
export const studentCreateAccount = asyncHandler(async (req, res) => {
  const { cnic, dob, password } = req.body
  if (!cnic || !dob || !password) {
    return res.status(400).json({ message: 'CNIC, date of birth and password are all required.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }

  const student = await Student.findOne({ cnic: cnic.trim() })
  if (!student) {
    return res.status(404).json({
      message: 'This CNIC was not found. Your Sub Admin must enroll you before you can create an account.',
    })
  }

  if (student.accountCreated) {
    return res.status(409).json({ message: 'An account already exists for this CNIC. Please log in instead.' })
  }

  const providedDob = new Date(dob).toISOString().slice(0, 10)
  const recordDob = new Date(student.dob).toISOString().slice(0, 10)
  if (providedDob !== recordDob) {
    return res.status(401).json({ message: 'The date of birth does not match our records.' })
  }

  student.password = await bcrypt.hash(password, 10)
  student.accountCreated = true
  student.history.push({ change: 'Account activated by student', by: student.name })
  await student.save()

  const token = generateToken(student._id, 'student')
  res.status(201).json({ token, role: 'student', user: sanitize(student) })
})

// --- Forgot password: request OTP (Super Admin / Sub Admin / Teacher only) ---
export const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, role, employeeId } = req.body
  if (!email || !role || !['superadmin', 'subadmin', 'teacher'].includes(role)) {
    return res.status(400).json({ message: 'A valid email and role are required.' })
  }

  const Model = modelByRole[role]
  const candidates = await Model.find({ email: email.toLowerCase().trim() })
  if (candidates.length === 0) {
    return res.status(404).json({ message: 'No account found with that email.' })
  }

  // Trainers and Sub Admins can share an email with another account of the
  // same role (their ID is the real unique key, not email), so if more than
  // one account matched, there's no password yet to disambiguate with - ask
  // for their ID instead.
  const idLabel = role === 'teacher' ? 'Trainer ID' : role === 'subadmin' ? 'Sub Admin ID' : 'ID'
  let account = candidates[0]
  if (candidates.length > 1) {
    if (!employeeId) {
      return res.status(409).json({
        message: `This email is used by ${candidates.length} accounts. Please enter your ${idLabel} to tell us which one is yours.`,
        code: 'NEED_EMPLOYEE_ID',
        idLabel,
        accountsFound: candidates.length,
      })
    }
    account = candidates.find((c) => c.employeeId === employeeId.trim())
    if (!account) {
      return res.status(404).json({ message: `No account found with that email and ${idLabel}.` })
    }
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  await Otp.create({
    accountModel: role === 'superadmin' ? 'SuperAdmin' : role === 'subadmin' ? 'SubAdmin' : 'Teacher',
    accountId: account._id,
    phone: account.phone,
    code,
    expiresAt,
  })

  await sendOtpWhatsApp(account.phone, code)

  const devExposeOtp = process.env.DEV_EXPOSE_OTP === 'true'
  res.json({
    message: `A 6-digit code was sent via WhatsApp to the number on file (${maskPhone(account.phone)}).`,
    maskedPhone: maskPhone(account.phone),
    ...(devExposeOtp ? { devOtp: code } : {}),
  })
})

// --- Forgot password: verify OTP + set new password ---
export const forgotPasswordVerify = asyncHandler(async (req, res) => {
  const { email, role, otp, newPassword, employeeId } = req.body
  if (!email || !role || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, role, OTP and new password are all required.' })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }

  const Model = modelByRole[role]
  const candidates = await Model.find({ email: email.toLowerCase().trim() })
  if (candidates.length === 0) {
    return res.status(404).json({ message: 'No account found with that email.' })
  }

  // Same disambiguation as the request step above - with a shared email,
  // the OTP code (tied to one specific account) is what actually pins down
  // which account this is, so try that first before asking for their ID.
  const accountModel = role === 'superadmin' ? 'SuperAdmin' : role === 'subadmin' ? 'SubAdmin' : 'Teacher'
  const idLabel = role === 'teacher' ? 'Trainer ID' : role === 'subadmin' ? 'Sub Admin ID' : 'ID'
  let account = candidates[0]
  if (candidates.length > 1) {
    if (employeeId) {
      account = candidates.find((c) => c.employeeId === employeeId.trim())
      if (!account) {
        return res.status(404).json({ message: `No account found with that email and ${idLabel}.` })
      }
    } else {
      const matchByOtp = await Otp.findOne({
        accountModel,
        accountId: { $in: candidates.map((c) => c._id) },
        code: otp,
        consumed: false,
      }).sort({ createdAt: -1 })
      if (!matchByOtp) {
        return res.status(401).json({ message: 'Invalid code.' })
      }
      account = candidates.find((c) => String(c._id) === String(matchByOtp.accountId))
    }
  }

  const otpDoc = await Otp.findOne({
    accountModel,
    accountId: account._id,
    code: otp,
    consumed: false,
  }).sort({ createdAt: -1 })

  if (!otpDoc) {
    return res.status(401).json({ message: 'Invalid code.' })
  }
  if (otpDoc.expiresAt < new Date()) {
    return res.status(401).json({ message: 'This code has expired. Please request a new one.' })
  }

  account.password = await bcrypt.hash(newPassword, 10)
  await account.save()

  otpDoc.consumed = true
  await otpDoc.save()

  res.json({ message: 'Password updated successfully. You can now log in with your new password.' })
})

// --- Change password (logged in) - Super Admin / Sub Admin / Teacher only, old password required ---
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new password are both required.' })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' })
  }

  const Model = modelByRole[req.role]
  const account = await Model.findById(req.user._id)

  const match = await bcrypt.compare(oldPassword, account.password)
  if (!match) {
    return res.status(401).json({ message: 'Your old password is incorrect.' })
  }

  account.password = await bcrypt.hash(newPassword, 10)
  await account.save()

  res.json({ message: 'Password changed successfully.' })
})

// --- Current logged-in user ---
export const getMe = asyncHandler(async (req, res) => {
  res.json({ role: req.role, user: sanitize(req.user) })
})
