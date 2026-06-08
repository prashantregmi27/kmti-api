import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    firstName:   { type: String, required: true, trim: true },
    lastName:    { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true, lowercase: true },
    phone:       { type: String, required: true, trim: true },
    dateOfBirth: { type: String },
    gender:      { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    course:      { type: String, required: true },
    address:     { type: String },
    gpa:         { type: String },
    passedYear:  { type: String },
    message:     { type: String },
    status:      { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Enrollment', enrollmentSchema);
