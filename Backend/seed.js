import 'dotenv/config'
import { connectDB } from './config/db.js'
import Course from './models/Course.js'
import Batch from './models/Batch.js'
import Teacher from './models/Teacher.js'
import SubAdmin from './models/SubAdmin.js'
import Student from './models/Student.js'
import Assignment from './models/Assignment.js'
import Module from './models/Module.js'
import Progress from './models/Progress.js'
import Quiz from './models/Quiz.js'
import Attendance from './models/Attendance.js'

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

  // Second pre-registered student (not yet activated) - use this CNIC to test
  // "Create Account" for a brand new student without touching the first one.
  const student2 = await Student.findOneAndUpdate(
    { cnic: '42101-7654321-2' },
    {
      name: 'Second Test Student', rollNumber: 'ROLL-002', course: course._id, batch: batch._id,
      teacher: teacher._id, city: 'Sukkur', campus: 'Titan Sukkur', createdBy: subAdmin._id,
    },
    { upsert: true, new: true }
  )

  // ---------- Sample Assignment (so Assignment page has something to submit) ----------
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 7) // due 7 days from now

  await Assignment.findOneAndUpdate(
    { name: 'Portfolio Landing Page', batch: batch._id },
    {
      teacher: teacher._id,
      course: course._id,
      batch: batch._id,
      name: 'Portfolio Landing Page',
      description: 'Build a responsive portfolio landing page using HTML, CSS and a bit of JavaScript. Include a hero section, a projects grid, and a contact form.',
      type: 'Project',
      dueDate,
      dueTime: '11:59 PM',
    },
    { upsert: true, new: true }
  )

  // ---------- Sample Module + Progress (so Progress page has topics to show) ----------
  const module1 = await Module.findOneAndUpdate(
    { course: course._id, title: 'HTML & CSS Fundamentals' },
    {
      course: course._id,
      title: 'HTML & CSS Fundamentals',
      order: 1,
      topics: [
        { name: 'HTML Document Structure' },
        { name: 'CSS Selectors & Box Model' },
        { name: 'Flexbox Layout' },
        { name: 'Responsive Design Basics' },
      ],
    },
    { upsert: true, new: true }
  )

  // Mark the first two topics of module 1 as completed
  const topicIds = module1.topics.map((t) => t._id)
  await Progress.findOneAndUpdate(
    { batch: batch._id, module: module1._id },
    {
      batch: batch._id,
      course: course._id,
      module: module1._id,
      teacher: teacher._id,
      topics: [
        { topic: topicIds[0], completed: true, completedDate: new Date() },
        { topic: topicIds[1], completed: true, completedDate: new Date() },
        { topic: topicIds[2], completed: false },
        { topic: topicIds[3], completed: false },
      ],
    },
    { upsert: true, new: true }
  )

  // ---------- Sample Quiz (so Quiz page has something to show) ----------
  await Quiz.findOneAndUpdate(
    { name: 'HTML & CSS Basics Quiz', batch: batch._id },
    {
      teacher: teacher._id,
      course: course._id,
      batch: batch._id,
      name: 'HTML & CSS Basics Quiz',
      totalMarks: 10,
      timerSeconds: 600,
      dueDate,
      dueTime: '11:59 PM',
      questions: [
        {
          text: 'Which tag is used to create a hyperlink in HTML?',
          options: ['<link>', '<a>', '<href>', '<nav>'],
          correctOptions: [1],
        },
        {
          text: 'Which CSS property controls the text size?',
          options: ['font-weight', 'text-size', 'font-size', 'text-style'],
          correctOptions: [2],
        },
      ],
    },
    { upsert: true, new: true }
  )

  // ---------- Sample Attendance (so Attendance page has records) ----------
  const today = new Date()
  for (let i = 0; i < 6; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i * 2) // every other day, going backwards
    await Attendance.findOneAndUpdate(
      { student: student._id, date },
      {
        student: student._id,
        batch: batch._id,
        course: course._id,
        date,
        status: i === 2 ? 'absent' : i === 4 ? 'leave' : 'present',
      },
      { upsert: true, new: true }
    )
  }

  console.log('Seed done.')
  console.log('Student 1 (already has assignment/progress/attendance data) CNIC:', student.cnic)
  console.log('Student 2 (fresh, not yet activated) CNIC:', student2.cnic)
  console.log('Teacher login -> email:', teacher.email, '| password: test123')
  process.exit(0)
}

seed()