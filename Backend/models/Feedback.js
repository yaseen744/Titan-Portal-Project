import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
    type: { type: String, enum: ['Bug', 'Idea', 'Other'], required: true },
    message: { type: String, required: true },
    image: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Feedback', feedbackSchema)
