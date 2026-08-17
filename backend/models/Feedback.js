import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },

    campus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campus',
      required: true,
    },

    type: {
      type: String,
      enum: ['Bug', 'Idea', 'Other'],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: '',
    },

    // General read status
    read: {
      type: Boolean,
      default: false,
    },

    // Read status is tracked separately per role.
    readBySubAdmin: {
      type: Boolean,
      default: false,
    },

    readBySuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Feedback', feedbackSchema)