import bcrypt from 'bcryptjs'
import Teacher from '../models/Teacher.js'
import Slot from '../models/Slot.js'
import Campus from '../models/Campus.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// Sub Admins only ever see/manage their own campus. Super Admin sees
// everything, optionally narrowed with ?campus= or ?city= query filters.
function scopeToCampus(req) {
  if (req.role === 'subadmin') return { campus: req.user.campus }
  const filter = {}
  if (req.query.campus) filter.campus = req.query.campus
  if (req.query.city) filter.city = req.query.city
  return filter
}

export const listTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find(scopeToCampus(req))
    .populate('campus', 'name city')
    .select('-password')
    .sort({ createdAt: -1 })
  res.json(teachers)
})

export const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate('campus', 'name city').select('-password')
  if (!teacher) return res.status(404).json({ message: 'Trainer not found.' })
  if (req.role === 'subadmin' && String(teacher.campus._id) !== String(req.user.campus)) {
    return res.status(403).json({ message: 'This trainer belongs to a different campus.' })
  }
  res.json(teacher)
})

export const createTeacher = asyncHandler(async (req, res) => {
  const { name, email, password, phone, employeeId, gender, photo, hourlyRate, bio, designation, socialLinks } = req.body
  let { campus } = req.body

  if (req.role === 'subadmin') campus = req.user.campus // subadmin can only add to their own campus

  if (!name || !email || !password || !phone || !campus || !employeeId) {
    return res.status(400).json({ message: 'Name, email, password, phone, ID and campus are required.' })
  }

  const campusDoc = await Campus.findById(campus)
  if (!campusDoc) return res.status(404).json({ message: 'Selected campus was not found.' })

  // A Trainer can only be added once this campus already has at least one
  // Slot (batch) set up for it - a trainer shouldn't exist with nowhere to
  // teach. Create the Slot first (it can be created without a Trainer
  // assigned yet), then add the Trainer and assign them to it.
  const hasSlot = await Slot.exists({ campus, isDeleted: false })
  if (!hasSlot) {
    return res.status(400).json({
      message: `${campusDoc.name} doesn't have any Slot yet. Create a Slot for this campus first, then add the Trainer.`,
    })
  }

  // A Trainer's uniqueness is anchored on their Trainer ID alone - two
  // trainers are allowed to share the same name, email, or phone number.
  const idTaken = await Teacher.findOne({ employeeId: employeeId.trim() }).lean()
  if (idTaken) {
    return res.status(409).json({ message: 'This Trainer ID is already in use. Please choose a different one.' })
  }

  const hashed = await bcrypt.hash(password, 10)

  const teacher = await Teacher.create({
    name,
    email,
    password: hashed,
    phone,
    employeeId: employeeId.trim(),
    gender,
    photo,
    city: campusDoc.city,
    campus,
    hourlyRate,
    bio,
    designation,
    socialLinks,
    createdBy: req.user._id,
    createdByModel: req.role === 'superadmin' ? 'SuperAdmin' : 'SubAdmin',
  })

  const safe = teacher.toObject()
  delete safe.password
  res.status(201).json(safe)
})

export const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
  if (!teacher) return res.status(404).json({ message: 'Trainer not found.' })
  if (req.role === 'subadmin' && String(teacher.campus) !== String(req.user.campus)) {
    return res.status(403).json({ message: 'This trainer belongs to a different campus.' })
  }

  const { name, email, password, phone, employeeId, gender, photo, hourlyRate, bio, designation, socialLinks } = req.body

  if (employeeId && employeeId.trim() !== teacher.employeeId) {
    const idTaken = await Teacher.findOne({ employeeId: employeeId.trim(), _id: { $ne: teacher._id } }).lean()
    if (idTaken) {
      return res.status(409).json({ message: 'This Trainer ID is already in use. Please choose a different one.' })
    }
    teacher.employeeId = employeeId.trim()
  }

  if (name) teacher.name = name
  if (email) teacher.email = email
  if (phone) teacher.phone = phone
  if (gender) teacher.gender = gender
  if (photo) teacher.photo = photo
  if (hourlyRate !== undefined) teacher.hourlyRate = hourlyRate
  if (bio !== undefined) teacher.bio = bio
  if (designation !== undefined) teacher.designation = designation
  if (socialLinks) teacher.socialLinks = socialLinks
  if (password) teacher.password = await bcrypt.hash(password, 10)

  await teacher.save()
  const safe = teacher.toObject()
  delete safe.password
  res.json(safe)
})

export const toggleSuspendTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
  if (!teacher) return res.status(404).json({ message: 'Trainer not found.' })
  teacher.status = teacher.status === 'suspended' ? 'active' : 'suspended'
  await teacher.save()
  res.json({ message: `Trainer ${teacher.status === 'suspended' ? 'suspended' : 'activated'}.`, status: teacher.status })
})

// Deleting a teacher requires a replacement; every Slot currently taught by
// the outgoing teacher is atomically reassigned to the new one, so their
// students see the new teacher's data from that point on.
export const deleteTeacherWithReplacement = asyncHandler(async (req, res) => {
  const outgoing = await Teacher.findById(req.params.id)
  if (!outgoing) return res.status(404).json({ message: 'Trainer not found.' })
  if (req.role === 'subadmin' && String(outgoing.campus) !== String(req.user.campus)) {
    return res.status(403).json({ message: 'This trainer belongs to a different campus.' })
  }

  const { replacement, existingTeacherId } = req.body

  let newTeacher
  if (existingTeacherId) {
    newTeacher = await Teacher.findById(existingTeacherId)
    if (!newTeacher) return res.status(404).json({ message: 'Replacement trainer not found.' })
  } else {
    if (!replacement || !replacement.name || !replacement.email || !replacement.password || !replacement.phone) {
      return res.status(400).json({
        message: 'A replacement trainer (name, email, password, phone) is required before this account can be removed.',
      })
    }
    const hashed = await bcrypt.hash(replacement.password, 10)
    const employeeId = await nextEmployeeId()
    newTeacher = await Teacher.create({
      name: replacement.name,
      email: replacement.email,
      password: hashed,
      phone: replacement.phone,
      employeeId,
      gender: replacement.gender,
      photo: replacement.photo,
      city: outgoing.city,
      campus: outgoing.campus,
      hourlyRate: replacement.hourlyRate,
      createdBy: req.user._id,
      createdByModel: req.role === 'superadmin' ? 'SuperAdmin' : 'SubAdmin',
    })
  }

  await Slot.updateMany({ teacher: outgoing._id }, { $set: { teacher: newTeacher._id } })

  const outgoingName = outgoing.name
  await Teacher.findByIdAndDelete(outgoing._id)

  res.json({
    message: `${outgoingName} sir/ma'am has been removed and now the new trainer is ${newTeacher.name}.`,
    newTeacher: { ...newTeacher.toObject(), password: undefined },
  })
})

export const updateMyTeacherProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, photo, bio, designation, socialLinks } = req.body
  const teacher = await Teacher.findById(req.user._id)

  if (name) teacher.name = name
  if (email) teacher.email = email
  if (phone) teacher.phone = phone
  if (photo) teacher.photo = photo
  if (bio !== undefined) teacher.bio = bio
  if (designation !== undefined) teacher.designation = designation
  if (socialLinks) teacher.socialLinks = socialLinks

  await teacher.save()
  const safe = teacher.toObject()
  delete safe.password
  res.json(safe)
})
