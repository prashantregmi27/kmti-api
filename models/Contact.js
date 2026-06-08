import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    contact:  { type: String, required: true, trim: true }, // email or phone
    topic:    { type: String, default: 'General Query' },
    question: { type: String, required: true },
    replied:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
