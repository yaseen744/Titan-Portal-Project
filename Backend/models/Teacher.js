import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    profilePic: { type: String, default: '' },
    city: { type: String, required: true },
    campus: { type: String, default: '' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
)

export default mongoose.model('Teacher', teacherSchema)