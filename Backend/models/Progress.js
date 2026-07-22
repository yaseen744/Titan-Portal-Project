import mongoose from 'mongoose'

const topicProgressSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, required: true }, // Module.topics._id
    completed: { type: Boolean, default: false },
    completedDate: { type: Date, default: null },
  },
  { _id: false }
)

const progressSchema = new mongoose.Schema(
  {
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    topics: { type: [topicProgressSchema], default: [] },
  },
  { timestamps: true }
)

progressSchema.index({ batch: 1, module: 1 }, { unique: true })

export default mongoose.model('Progress', progressSchema)