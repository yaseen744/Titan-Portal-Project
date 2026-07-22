import 'dotenv/config'
import { connectDB } from './config/db.js'
import Course from './models/Course.js'
import Batch from './models/Batch.js'
import Teacher from './models/Teacher.js'
import SubAdmin from './models/SubAdmin.js'
import Student from './models/Student.js'

async function seed() {
  await connectDB()

  const course = await Course.findOneAndUpdate(
    { name: 'Web Development' }, {}, { upsert: true, new: true }
  )
  const subAdmin = await SubAdmin.findOneAndUpdate(
    { email: 'subadmin@titan.com' },
    { name: 'Test SubAdmin', password: 'test123', city: 'Sukkur', campus: 'Titan Sukkur' },
    { upsert: true, new: true }
  )
  const teacher = await Teacher.findOneAndUpdate(
    { email: 'teacher@titan.com' },
    { name: 'Test Teacher', password: 'test123', employeeId: 'EMP001', city: 'Sukkur' },
    { upsert: true, new: true }
  )
  const batch = await Batch.findOneAndUpdate(
    { course: course._id, batchNumber: 'Batch-1' },
    { city: 'Sukkur', campus: 'Titan Sukkur', days: ['Mon', 'Wed', 'Fri'], time: '5:00 PM - 7:00 PM', teacher: teacher._id },
    { upsert: true, new: true }
  )
  const student = await Student.findOneAndUpdate(
    { cnic: '42101-1234567-1' },
    {
      name: 'Test Student', rollNumber: 'ROLL-001', course: course._id, batch: batch._id,
      teacher: teacher._id, city: 'Sukkur', campus: 'Titan Sukkur', createdBy: subAdmin._id,
    },
    { upsert: true, new: true }
  )

  console.log('Seed done. Student CNIC to test Create Account with:', student.cnic)
  process.exit(0)
}

seed()