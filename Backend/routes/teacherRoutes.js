import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { loginTeacher } from '../controllers/teacherAuthController.js'
import {
  getDashboard, getCourses, getCourseDetail, getStudentDetail,
  getAttendanceForDate, markAttendance, getAttendanceOverview,
  getAssignments, createAssignment, closeAssignment, deleteAssignment,
  getAssignmentSubmissions, updateSubmissionStatus,
  getQuizzes, createQuiz, updateQuiz, deleteQuiz, getQuizAttempts, resetStudentAttempts,
  getCourseProgress, toggleTopic, getCourseComparison,
  updateProfile, updatePassword,
} from '../controllers/teacherController.js'

const router = express.Router()

router.post('/login', loginTeacher)

router.get('/dashboard', requireAuth('teacher'), getDashboard)

router.get('/courses', requireAuth('teacher'), getCourses)
router.get('/courses/:batchId', requireAuth('teacher'), getCourseDetail)

router.get('/students/:studentId', requireAuth('teacher'), getStudentDetail)

router.get('/attendance', requireAuth('teacher'), getAttendanceForDate)
router.post('/attendance', requireAuth('teacher'), markAttendance)
router.get('/attendance/overview', requireAuth('teacher'), getAttendanceOverview)

router.get('/assignments', requireAuth('teacher'), getAssignments)
router.post('/assignments', requireAuth('teacher'), createAssignment)
router.put('/assignments/:id/close', requireAuth('teacher'), closeAssignment)
router.delete('/assignments/:id', requireAuth('teacher'), deleteAssignment)
router.get('/assignments/:id/submissions', requireAuth('teacher'), getAssignmentSubmissions)
router.put('/submissions/:submissionId', requireAuth('teacher'), updateSubmissionStatus)

router.get('/quizzes', requireAuth('teacher'), getQuizzes)
router.post('/quizzes', requireAuth('teacher'), createQuiz)
router.put('/quizzes/:id', requireAuth('teacher'), updateQuiz)
router.delete('/quizzes/:id', requireAuth('teacher'), deleteQuiz)
router.get('/quizzes/:id/attempts', requireAuth('teacher'), getQuizAttempts)
router.delete('/quizzes/:id/attempts/:studentId', requireAuth('teacher'), resetStudentAttempts)

router.get('/progress', requireAuth('teacher'), getCourseProgress)
router.put('/progress', requireAuth('teacher'), toggleTopic)
router.get('/progress/comparison', requireAuth('teacher'), getCourseComparison)

router.put('/profile', requireAuth('teacher'), updateProfile)
router.put('/password', requireAuth('teacher'), updatePassword)

export default router
