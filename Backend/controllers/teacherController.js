import Teacher from '../models/Teacher.js'
import Student from '../models/Student.js'
import Batch from '../models/Batch.js'
import Course from '../models/Course.js'
import Assignment from '../models/Assignment.js'
import Submission from '../models/Submission.js'
import Quiz from '../models/Quiz.js'
import QuizAttempt from '../models/QuizAttempt.js'
import Attendance from '../models/Attendance.js'
import Module from '../models/Module.js'
import Progress from '../models/Progress.js'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ---------------- helpers ----------------
async function batchSummary(batch) {
  const enrolledCount = await Student.countDocuments({ batch: batch._id })
  const modules = await Module.find({ course: batch.course._id || batch.course })
  const progressDocs = await Progress.find({ batch: batch._id })

  let totalTopics = 0
  let completedTopics = 0
  for (const m of modules) {
    totalTopics += m.topics.length
    const p = progressDocs.find((pd) => String(pd.module) === String(m._id))
    if (p) completedTopics += p.topics.filter((t) => t.completed).length
  }
  const progressPercent = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0

  return {
    _id: batch._id,
    courseId: batch.course._id || batch.course,
    courseName: batch.course.name || '',
    batchNumber: batch.batchNumber,
    city: batch.city,
    campus: batch.campus,
    days: batch.days,
    time: batch.time,
    startDate: batch.startDate,
    enrolledCount,
    progressPercent,
  }
}

// ---------------- DASHBOARD ----------------
export async function getDashboard(req, res) {
  const teacher = await Teacher.findById(req.user.id)
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' })

  const batches = await Batch.find({ teacher: teacher._id }).populate('course')
  const batchIds = batches.map((b) => b._id)

  const enrolledStudents = await Student.countDocuments({ batch: { $in: batchIds } })
  const totalAssignments = await Assignment.countDocuments({ teacher: teacher._id })

  const scheduleDaySet = new Set()
  for (const b of batches) {
    for (const d of b.days || []) scheduleDaySet.add(d)
  }

  const summaries = await Promise.all(batches.map(batchSummary))

  res.json({
    teacher: sanitize(teacher),
    activeCoursesCount: batches.length,
    enrolledStudents,
    totalAssignments,
    scheduleDays: Array.from(scheduleDaySet),
    courses: summaries,
  })
}

// ---------------- COURSES (batches taught) ----------------
export async function getCourses(req, res) {
  const batches = await Batch.find({ teacher: req.user.id }).populate('course')
  const summaries = await Promise.all(batches.map(batchSummary))
  res.json({ courses: summaries })
}

export async function getCourseDetail(req, res) {
  const batch = await Batch.findOne({ _id: req.params.batchId, teacher: req.user.id }).populate('course')
  if (!batch) return res.status(404).json({ message: 'Course/batch not found' })

  const summary = await batchSummary(batch)
  const students = await Student.find({ batch: batch._id }).select(
    'name rollNumber profilePic email enrollmentStatus'
  )
  res.json({ course: summary, students })
}

// ---------------- STUDENT DETAIL ----------------
export async function getStudentDetail(req, res) {
  const student = await Student.findById(req.params.studentId).populate('batch').populate('course')
  if (!student) return res.status(404).json({ message: 'Student not found' })
  if (String(student.teacher) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not authorized to view this student' })
  }

  const attendanceRecords = await Attendance.find({ student: student._id })
  const total = attendanceRecords.length
  const present = attendanceRecords.filter((r) => r.status === 'present').length
  const attendancePercent = total ? Math.round((present / total) * 100) : 0

  const assignments = await Assignment.find({ batch: student.batch._id })
  const assignmentStatus = await Promise.all(
    assignments.map(async (a) => {
      const sub = await Submission.findOne({ assignment: a._id, student: student._id })
      return { assignmentId: a._id, name: a.name, status: sub?.status || 'not submitted' }
    })
  )

  const quizzes = await Quiz.find({ batch: student.batch._id })
  const quizStatus = await Promise.all(
    quizzes.map(async (q) => {
      const attempts = await QuizAttempt.find({ quiz: q._id, student: student._id })
      const best = attempts.reduce((b, a) => (!b || a.percentage > b.percentage ? a : b), null)
      return {
        quizId: q._id,
        name: q.name,
        attemptsUsed: attempts.length,
        percentage: best?.percentage || 0,
        passed: best?.passed || false,
      }
    })
  )

  res.json({
    student: {
      _id: student._id,
      name: student.name,
      rollNumber: student.rollNumber,
      profilePic: student.profilePic,
      email: student.email,
      phone: student.phone,
      city: student.city,
      campus: student.campus,
      course: student.course?.name,
      batch: student.batch?.batchNumber,
    },
    attendancePercent,
    assignmentStatus,
    quizStatus,
  })
}

// ---------------- ATTENDANCE ----------------
export async function getAttendanceForDate(req, res) {
  const { batchId } = req.query
  const date = req.query.date ? new Date(req.query.date) : new Date()
  date.setHours(0, 0, 0, 0)

  const batch = await Batch.findOne({ _id: batchId, teacher: req.user.id })
  if (!batch) return res.status(404).json({ message: 'Batch not found' })

  const students = await Student.find({ batch: batch._id }).select('name rollNumber profilePic')
  const records = await Attendance.find({ batch: batch._id, date })

  const merged = students.map((s) => {
    const rec = records.find((r) => String(r.student) === String(s._id))
    return {
      studentId: s._id,
      name: s.name,
      rollNumber: s.rollNumber,
      profilePic: s.profilePic,
      status: rec?.status || 'absent',
      timeIn: rec?.timeIn || '',
      lateMinutes: rec?.lateMinutes || 0,
    }
  })

  const total = merged.length
  const present = merged.filter((m) => m.status === 'present').length
  const absent = merged.filter((m) => m.status === 'absent').length
  const leave = merged.filter((m) => m.status === 'leave').length

  res.json({ date, total, present, absent, leave, students: merged })
}

export async function markAttendance(req, res) {
  const { batchId, date, records } = req.body // records: [{studentId, status, timeIn, lateMinutes}]
  const batch = await Batch.findOne({ _id: batchId, teacher: req.user.id })
  if (!batch) return res.status(404).json({ message: 'Batch not found' })

  const day = new Date(date)
  day.setHours(0, 0, 0, 0)

  for (const r of records) {
    const student = await Student.findById(r.studentId)
    if (!student) continue
    await Attendance.findOneAndUpdate(
      { student: r.studentId, date: day },
      {
        student: r.studentId,
        batch: batch._id,
        course: batch.course,
        date: day,
        status: r.status,
        timeIn: r.timeIn || '',
        lateMinutes: r.lateMinutes || 0,
      },
      { upsert: true, new: true }
    )
  }

  res.json({ message: 'Attendance saved' })
}

// Overall / this-slot attendance overview grouped by month, for TeacherAttendance page
export async function getAttendanceOverview(req, res) {
  const { batchId } = req.query // 'all' or a specific batch id
  const batches = await Batch.find({ teacher: req.user.id })
  const batchIds = batchId && batchId !== 'all' ? [batchId] : batches.map((b) => b._id)

  const records = await Attendance.find({ batch: { $in: batchIds } })
    .populate('student', 'name rollNumber')
    .sort({ date: 1 })

  const totalClasses = records.length
  const present = records.filter((r) => r.status === 'present').length
  const totalLateMinutes = records.reduce((sum, r) => sum + (r.lateMinutes || 0), 0)

  res.json({
    totalClasses,
    present,
    totalLateMinutes,
    records: records.map((r) => ({
      date: r.date,
      studentName: r.student?.name,
      rollNumber: r.student?.rollNumber,
      status: r.status,
      timeIn: r.timeIn,
      lateMinutes: r.lateMinutes,
    })),
  })
}

// ---------------- ASSIGNMENTS ----------------
export async function getAssignments(req, res) {
  const { batchId } = req.query
  const page = parseInt(req.query.page) || 1
  const limit = 8
  const filter = { teacher: req.user.id }
  if (batchId) filter.batch = batchId

  const total = await Assignment.countDocuments(filter)
  const assignments = await Assignment.find(filter)
    .sort({ dueDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  const withCounts = await Promise.all(
    assignments.map(async (a) => {
      const subs = await Submission.find({ assignment: a._id })
      return {
        ...a.toObject(),
        approvedCount: subs.filter((s) => s.status === 'approved').length,
        notApprovedCount: subs.filter((s) => s.status === 'disapproved').length,
        submittedCount: subs.filter((s) => ['submitted', 'late', 'approved', 'disapproved'].includes(s.status)).length,
      }
    })
  )

  res.json({ assignments: withCounts, total, page, totalPages: Math.ceil(total / limit) })
}

export async function createAssignment(req, res) {
  const { batchId, name, description, type, dueDate, dueTime } = req.body
  const batch = await Batch.findOne({ _id: batchId, teacher: req.user.id })
  if (!batch) return res.status(404).json({ message: 'Batch not found' })

  const assignment = await Assignment.create({
    teacher: req.user.id,
    course: batch.course,
    batch: batch._id,
    name,
    description,
    type,
    dueDate,
    dueTime,
  })
  res.status(201).json({ assignment })
}

export async function closeAssignment(req, res) {
  const assignment = await Assignment.findOne({ _id: req.params.id, teacher: req.user.id })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  assignment.submissionClosed = true
  await assignment.save()
  res.json({ assignment })
}

export async function deleteAssignment(req, res) {
  const assignment = await Assignment.findOne({ _id: req.params.id, teacher: req.user.id })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  await Submission.deleteMany({ assignment: assignment._id })
  await assignment.deleteOne()
  res.json({ message: 'Assignment deleted' })
}

export async function getAssignmentSubmissions(req, res) {
  const assignment = await Assignment.findOne({ _id: req.params.id, teacher: req.user.id })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })

  const submissions = await Submission.find({ assignment: assignment._id }).populate(
    'student',
    'name rollNumber profilePic'
  )
  const approvedCount = submissions.filter((s) => s.status === 'approved').length
  const notApprovedCount = submissions.filter((s) => s.status === 'disapproved').length

  res.json({ assignment, submissions, approvedCount, notApprovedCount })
}

export async function updateSubmissionStatus(req, res) {
  const { status } = req.body // 'approved' | 'disapproved'
  const submission = await Submission.findById(req.params.submissionId).populate('assignment')
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  if (String(submission.assignment.teacher) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  submission.status = status
  await submission.save()
  res.json({ submission })
}

// ---------------- QUIZZES ----------------
export async function getQuizzes(req, res) {
  const { batchId } = req.query
  const page = parseInt(req.query.page) || 1
  const limit = 8
  const filter = { teacher: req.user.id }
  if (batchId) filter.batch = batchId

  const total = await Quiz.countDocuments(filter)
  const quizzes = await Quiz.find(filter)
    .sort({ dueDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  res.json({ quizzes, total, page, totalPages: Math.ceil(total / limit) })
}

export async function createQuiz(req, res) {
  const { batchId, name, totalMarks, timerSeconds, dueDate, dueTime, questions } = req.body
  const batch = await Batch.findOne({ _id: batchId, teacher: req.user.id })
  if (!batch) return res.status(404).json({ message: 'Batch not found' })

  const quiz = await Quiz.create({
    teacher: req.user.id,
    course: batch.course,
    batch: batch._id,
    name,
    totalMarks,
    timerSeconds,
    dueDate,
    dueTime,
    questions: questions || [],
  })
  res.status(201).json({ quiz })
}

export async function updateQuiz(req, res) {
  const quiz = await Quiz.findOne({ _id: req.params.id, teacher: req.user.id })
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

  const allowed = ['name', 'totalMarks', 'timerSeconds', 'dueDate', 'dueTime', 'questions']
  for (const key of allowed) if (req.body[key] !== undefined) quiz[key] = req.body[key]
  await quiz.save()
  res.json({ quiz })
}

export async function deleteQuiz(req, res) {
  const quiz = await Quiz.findOne({ _id: req.params.id, teacher: req.user.id })
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
  await QuizAttempt.deleteMany({ quiz: quiz._id })
  await quiz.deleteOne()
  res.json({ message: 'Quiz deleted' })
}

export async function getQuizAttempts(req, res) {
  const quiz = await Quiz.findOne({ _id: req.params.id, teacher: req.user.id })
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

  const attempts = await QuizAttempt.find({ quiz: quiz._id }).populate('student', 'name rollNumber')
  // group by student
  const byStudent = {}
  for (const a of attempts) {
    const sid = String(a.student._id)
    if (!byStudent[sid]) {
      byStudent[sid] = {
        studentId: sid,
        name: a.student.name,
        rollNumber: a.student.rollNumber,
        attempts: [],
      }
    }
    byStudent[sid].attempts.push(a)
  }
  res.json({ quiz, students: Object.values(byStudent) })
}

export async function resetStudentAttempts(req, res) {
  const quiz = await Quiz.findOne({ _id: req.params.id, teacher: req.user.id })
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
  await QuizAttempt.deleteMany({ quiz: quiz._id, student: req.params.studentId })
  res.json({ message: 'Attempts reset for this student' })
}

// ---------------- PROGRESS ----------------
export async function getCourseProgress(req, res) {
  const batch = await Batch.findOne({ _id: req.query.batchId, teacher: req.user.id })
  if (!batch) return res.status(404).json({ message: 'Batch not found' })

  const modules = await Module.find({ course: batch.course }).sort({ order: 1 })
  const progressDocs = await Progress.find({ batch: batch._id })

  const result = modules.map((m) => {
    const p = progressDocs.find((pd) => String(pd.module) === String(m._id))
    const topics = m.topics.map((t) => {
      const status = p?.topics.find((pt) => String(pt.topic) === String(t._id))
      return { topicId: t._id, name: t.name, completed: !!status?.completed, completedDate: status?.completedDate }
    })
    return { moduleId: m._id, title: m.title, order: m.order, topics }
  })

  res.json({ modules: result })
}

export async function toggleTopic(req, res) {
  const { batchId, moduleId, topicId, completed } = req.body
  const batch = await Batch.findOne({ _id: batchId, teacher: req.user.id })
  if (!batch) return res.status(404).json({ message: 'Batch not found' })

  let progress = await Progress.findOne({ batch: batchId, module: moduleId })
  if (!progress) {
    progress = new Progress({ batch: batchId, course: batch.course, module: moduleId, teacher: req.user.id, topics: [] })
  }

  const existing = progress.topics.find((t) => String(t.topic) === String(topicId))
  if (existing) {
    existing.completed = completed
    existing.completedDate = completed ? new Date() : null
  } else {
    progress.topics.push({ topic: topicId, completed, completedDate: completed ? new Date() : null })
  }
  await progress.save()
  res.json({ progress })
}

export async function getCourseComparison(req, res) {
  const batch = await Batch.findOne({ _id: req.query.batchId, teacher: req.user.id }).populate('course')
  if (!batch) return res.status(404).json({ message: 'Batch not found' })

  const modules = await Module.find({ course: batch.course._id })
  const totalTopics = modules.reduce((sum, m) => sum + m.topics.length, 0)

  const otherBatches = await Batch.find({
    course: batch.course._id,
    teacher: { $ne: req.user.id },
  }).populate('teacher', 'name')

  const comparison = await Promise.all(
    otherBatches.map(async (b) => {
      const progressDocs = await Progress.find({ batch: b._id })
      const totalCovered = progressDocs.reduce((sum, p) => sum + p.topics.filter((t) => t.completed).length, 0)
      return {
        teacherName: b.teacher?.name || 'Unassigned',
        campus: b.campus,
        batchNumber: b.batchNumber,
        days: b.days,
        time: b.time,
        totalCoveredTopics: totalCovered,
        totalTopics,
      }
    })
  )

  res.json({ comparison })
}

// ---------------- PROFILE ----------------
export async function updateProfile(req, res) {
  const allowed = ['name', 'email', 'phone', 'bio', 'profilePic', 'socialLinks', 'hourlyRate']
  const updates = {}
  for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key]

  const teacher = await Teacher.findByIdAndUpdate(req.user.id, updates, { new: true })
  res.json({ teacher: sanitize(teacher) })
}

export async function updatePassword(req, res) {
  const { oldPassword, newPassword } = req.body
  const teacher = await Teacher.findById(req.user.id)
  if (teacher.password !== oldPassword) {
    return res.status(400).json({ message: 'Old password is incorrect' })
  }
  teacher.password = newPassword
  await teacher.save()
  res.json({ message: 'Password updated' })
}

function sanitize(teacher) {
  const obj = teacher.toObject()
  delete obj.password
  return obj
}
