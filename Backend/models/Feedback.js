import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'SubAdmin', required: true }, // same campus
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    type: { type: String, enum: ['BUG', 'IDEA', 'OTHER'], required: true },
    message: { type: String, required: true },
    image: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Feedback', feedbackSchema)