import mongoose from 'mongoose'

const topicSchema = new mongoose.Schema({ name: { type: String, required: true } }, { _id: true })

const moduleSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    topics: { type: [topicSchema], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('Module', moduleSchema)