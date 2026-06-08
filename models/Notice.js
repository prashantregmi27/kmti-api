import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    content:  { type: String, required: true },
    tag:      { type: String, enum: ['Admission', 'Exam', 'Event', 'Holiday', 'Result', 'Scholarship'], default: 'Admission' },
    date:     { type: String, required: true }, // e.g. "15 Ashadh"
    links:    [{ title: String, url: String }],
    images:   [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Notice', noticeSchema);
