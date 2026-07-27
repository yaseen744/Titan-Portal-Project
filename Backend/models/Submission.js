import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    content: { type: String, default: '' },
    submittedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'late', 'approved', 'disapproved'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true })

export default mongoose.model('Submission', submissionSchema)