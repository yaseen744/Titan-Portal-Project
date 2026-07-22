import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { loginStudent, createStudentAccount } from '../controllers/studentAuthController.js'
import {
  getDashboard,
  updateProfile,
  updatePassword,
  getAttendance,
  getAssignments,
  submitAssignment,
  getQuizzes,
  startQuiz,
  submitQuiz,
  getProgress,
  sendFeedback,
} from '../controllers/studentController.js'

const router = express.Router()

// public
router.post('/login', loginStudent)
router.post('/create-account', createStudentAccount)

// protected
router.use(requireAuth('student'))
router.get('/dashboard', getDashboard)
router.put('/profile', updateProfile)
router.put('/profile/password', updatePassword)
router.get('/attendance', getAttendance)
router.get('/assignments', getAssignments)
router.post('/assignments/submit', submitAssignment)
router.get('/quizzes', getQuizzes)
router.get('/quizzes/:quizId/start', startQuiz)
router.post('/quizzes/:quizId/submit', submitQuiz)
router.get('/progress', getProgress)
router.post('/feedback', sendFeedback)

export default router