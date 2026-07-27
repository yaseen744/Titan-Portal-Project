import mongoose from 'mongoose'

const batchSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batchNumber: { type: String, required: true },
    city: { type: String, required: true },
    campus: { type: String, default: '' },
    days: { type: [String], default: [] },
    time: { type: String, default: '' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    startDate: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Batch', batchSchema)