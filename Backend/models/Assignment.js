import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, default: '' },
    dueDate: { type: Date, required: true },
    dueTime: { type: String, default: '' },
    submissionClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Assignment', assignmentSchema)