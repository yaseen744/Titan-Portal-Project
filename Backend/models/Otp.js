import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    accountModel: { type: String, enum: ['SuperAdmin', 'SubAdmin', 'Teacher'], required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, required: true },
    phone: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// MongoDB TTL index - documents are automatically deleted once expiresAt passes.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model('Otp', otpSchema)
