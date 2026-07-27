import mongoose from 'mongoose'

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    attemptNumber: { type: Number, default: 1 }, // max 3
    answers: [{ questionId: mongoose.Schema.Types.ObjectId, selected: [Number] }],
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('QuizAttempt', quizAttemptSchema)