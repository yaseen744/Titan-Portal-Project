import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: { type: [String], required: true },
    correctOptions: { type: [Number], required: true }, // indexes into options[]
  },
  { _id: true }
)

const quizSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    name: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    timerSeconds: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    dueTime: { type: String, default: '' },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('Quiz', quizSchema)