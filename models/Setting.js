import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  label: { type: String },
  type:  { type: String, enum: ['text', 'textarea', 'image', 'url', 'email', 'phone', 'number'], default: 'text' },
  section: { type: String, default: 'general' },
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
