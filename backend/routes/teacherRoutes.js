import express from 'express'
import {
  listTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  toggleSuspendTeacher,
  deleteTeacherWithReplacement,
  updateMyTeacherProfile,
} from '../controllers/teacherController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.put('/me/profile', restrictTo('teacher'), updateMyTeacherProfile)

router.get('/', restrictTo('superadmin', 'subadmin'), listTeachers)
router.get('/:id', restrictTo('superadmin', 'subadmin'), getTeacher)
router.post('/', restrictTo('superadmin', 'subadmin'), createTeacher)
router.put('/:id', restrictTo('superadmin', 'subadmin'), updateTeacher)
router.put('/:id/suspend', restrictTo('superadmin', 'subadmin'), toggleSuspendTeacher)
router.delete('/:id', restrictTo('superadmin', 'subadmin'), deleteTeacherWithReplacement)

export default router
