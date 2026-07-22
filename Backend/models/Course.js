import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Web Development, AI, Graphic Designing, Freelancing...
  },
  { timestamps: true }
)

export default mongoose.model('Course', courseSchema)