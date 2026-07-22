import mongoose from 'mongoose'

const subAdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    campus: { type: String, default: '' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
)

export default mongoose.model('SubAdmin', subAdminSchema)