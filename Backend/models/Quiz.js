import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { _id: true }
)

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: { type: [optionSchema], validate: (v) => v.length >= 2 },
    correctOptionIndexes: { type: [Number], required: true }, // supports multiple correct options
  },
  { _id: true }
)

const quizSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    title: { type: String, required: true, trim: true },
    totalMarks: { type: Number, required: true },
    timerMinutes: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    dueTime: { type: String, default: '' },
    questions: { type: [questionSchema], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

quizSchema.virtual('totalQuestions').get(function () {
  return this.questions.length
})

export default mongoose.model('Quiz', quizSchema)
