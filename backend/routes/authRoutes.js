import express from 'express'
import {
  loginWithEmail,
  loginStudent,
  studentCreateAccount,
  forgotPasswordRequest,
  forgotPasswordVerify,
  changePassword,
  getMe,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/login/superadmin', loginWithEmail('superadmin'))
router.post('/login/subadmin', loginWithEmail('subadmin'))
router.post('/login/teacher', loginWithEmail('teacher'))
router.post('/login/student', loginStudent)

router.post('/student/create-account', studentCreateAccount)

router.post('/forgot-password/request', forgotPasswordRequest)
router.post('/forgot-password/verify', forgotPasswordVerify)

router.post('/change-password', protect, changePassword)
router.get('/me', protect, getMe)

export default router
