import Student from '../models/Student.js'
import Attendance from '../models/Attendance.js'
import Assignment from '../models/Assignment.js'
import Submission from '../models/Submission.js'
import Quiz from '../models/Quiz.js'
import QuizAttempt from '../models/QuizAttempt.js'
import Progress from '../models/Progress.js'
import Feedback from '../models/Feedback.js'
import Batch from '../models/Batch.js'

// ---------- DASHBOARD ----------
export async function getDashboard(req, res) {
  const student = await Student.findById(req.user.id)
    .populate('course')
    .populate('batch')
    .populate('teacher', 'name email')
  if (!student) return res.status(404).json({ message: 'Student not found' })

  const assignmentsCount = await Assignment.countDocuments({ batch: student.batch._id })
  res.json({ student: sanitize(student), assignmentsCount })
}

// ---------- PROFILE ----------
export async function updateProfile(req, res) {
  const allowed = ['name', 'email', 'dob', 'gender', 'phone', 'address', 'profilePic']
  const updates = {}
  for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key]

  const student = await Student.findByIdAndUpdate(req.user.id, updates, { new: true })
  res.json({ student: sanitize(student) })
}

export async function updatePassword(req, res) {
  const { oldPassword, newPassword } = req.body
  const student = await Student.findById(req.user.id)
  if (student.password !== oldPassword) {
    return res.status(400).json({ message: 'Old password is incorrect' })
  }
  student.password = newPassword
  await student.save()
  res.json({ message: 'Password updated' })
}

// ---------- ATTENDANCE ----------
export async function getAttendance(req, res) {
  const student = await Student.findById(req.user.id)
  const records = await Attendance.find({ student: student._id }).sort({ date: 1 })

  const total = records.length
  const present = records.filter((r) => r.status === 'present').length
  const percentage = total ? Math.round((present / total) * 100) : 0

  let message = ''
  let level = ''
  if (percentage >= 90) {
    message = 'Your attendance is Outstanding, please continue like that!'
    level = 'outstanding'
  } else if (percentage >= 70) {
    message = 'Your attendance is good. Keep it up!'
    level = 'good'
  } else {
    message = 'Your attendance is not good, please improve your attendance!'
    level = 'warning'
  }

  res.json({ records, percentage, message, level })
}

// ---------- ASSIGNMENTS ----------
export async function getAssignments(req, res) {
  const student = await Student.findById(req.user.id)
  const page = parseInt(req.query.page) || 1
  const limit = 8
  const filter = { batch: student.batch }

  const total = await Assignment.countDocuments(filter)
  const assignments = await Assignment.find(filter)
    .sort({ dueDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  const withStatus = await Promise.all(
    assignments.map(async (a) => {
      const sub = await Submission.findOne({ assignment: a._id, student: student._id })
      return { ...a.toObject(), submission: sub || null }
    })
  )

  res.json({ assignments: withStatus, total, page, totalPages: Math.ceil(total / limit) })
}

export async function submitAssignment(req, res) {
  const { assignmentId, content } = req.body
  const assignment = await Assignment.findById(assignmentId)
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  if (assignment.submissionClosed) {
    return res.status(400).json({ message: 'Submissions are closed for this assignment' })
  }

  const now = new Date()
  const isLate = now > assignment.dueDate

  const submission = await Submission.findOneAndUpdate(
    { assignment: assignmentId, student: req.user.id },
    { content, submittedAt: now, status: isLate ? 'late' : 'submitted' },
    { upsert: true, new: true }
  )

  res.json({ submission })
}

// ---------- QUIZZES ----------
export async function getQuizzes(req, res) {
  const student = await Student.findById(req.user.id)
  const page = parseInt(req.query.page) || 1
  const limit = 8
  const filter = { batch: student.batch }

  const total = await Quiz.countDocuments(filter)
  const quizzes = await Quiz.find(filter)
    .select('-questions.correctOptions') // never leak correct answers to student list view
    .sort({ dueDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  const withAttempts = await Promise.all(
    quizzes.map(async (q) => {
      const attempts = await QuizAttempt.find({ quiz: q._id, student: student._id })
      return { ...q.toObject(), attemptsUsed: attempts.length, attempts }
    })
  )

  res.json({ quizzes: withAttempts, total, page, totalPages: Math.ceil(total / limit) })
}

export async function startQuiz(req, res) {
  const quiz = await Quiz.findById(req.params.quizId)
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

  const attemptsCount = await QuizAttempt.countDocuments({ quiz: quiz._id, student: req.user.id })
  if (attemptsCount >= 3) {
    return res.status(400).json({ message: 'Maximum attempts (3) reached. Ask your teacher to reset it.' })
  }

  // send questions WITHOUT correct answers
  const safeQuestions = quiz.questions.map((q) => ({
    _id: q._id,
    text: q.text,
    options: q.options,
  }))
  res.json({ quizId: quiz._id, name: quiz.name, timerSeconds: quiz.timerSeconds, questions: safeQuestions })
}

export async function submitQuiz(req, res) {
  const { answers } = req.body // [{ questionId, selected: [indexes] }]
  const quiz = await Quiz.findById(req.params.quizId)
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

  const attemptsCount = await QuizAttempt.countDocuments({ quiz: quiz._id, student: req.user.id })
  if (attemptsCount >= 3) {
    return res.status(400).json({ message: 'Maximum attempts (3) reached.' })
  }

  let correctCount = 0
  for (const q of quiz.questions) {
    const given = answers.find((a) => String(a.questionId) === String(q._id))
    const givenSorted = (given?.selected || []).slice().sort()
    const correctSorted = q.correctOptions.slice().sort()
    const isCorrect =
      givenSorted.length === correctSorted.length &&
      givenSorted.every((v, i) => v === correctSorted[i])
    if (isCorrect) correctCount++
  }
  const totalQuestions = quiz.questions.length
  const incorrectCount = totalQuestions - correctCount
  const percentage = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0
  const passed = percentage >= 70

  const attempt = await QuizAttempt.create({
    quiz: quiz._id,
    student: req.user.id,
    attemptNumber: attemptsCount + 1,
    answers,
    correctCount,
    incorrectCount,
    percentage,
    passed,
    completedAt: new Date(),
  })

  res.json({ attempt, totalQuestions, correctCount, incorrectCount, percentage, passed })
}

// ---------- PROGRESS ----------
export async function getProgress(req, res) {
  const student = await Student.findById(req.user.id)
  const progressDocs = await Progress.find({ batch: student.batch })
    .populate('module')
    .populate('teacher', 'name')
  res.json({ progress: progressDocs })
}

// ---------- FEEDBACK ----------
export async function sendFeedback(req, res) {
  const { type, message, image } = req.body
  const student = await Student.findById(req.user.id)

  // subAdmin is whoever created this student (same campus)
  const feedback = await Feedback.create({
    student: student._id,
    subAdmin: student.createdBy,
    teacher: student.teacher,
    course: student.course,
    type,
    message,
    image,
  })
  res.json({ feedback })
}

function sanitize(student) {
  const obj = student.toObject()
  delete obj.password
  return obj
}