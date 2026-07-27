import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'leave'], default: 'absent' },
    timeIn: { type: String, default: '' },
    lateMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
)

attendanceSchema.index({ student: 1, date: 1 }, { unique: true })

export default mongoose.model('Attendance', attendanceSchema)