import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    password: { type: String, default: null }, // set when student does "Create Account" with CNIC
    cnic: { type: String, required: true, unique: true }, // added by sub-admin first
    fatherName: { type: String, default: '' },
    fatherCnic: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    profilePic: { type: String, default: '' },
    rollNumber: { type: String, required: true, unique: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    slot: { type: String, default: '' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    city: { type: String, required: true },
    campus: { type: String, default: '' },
    enrollmentStatus: { type: String, enum: ['enrolled', 'dropped'], default: 'enrolled' },
    accountActivated: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Student', studentSchema)