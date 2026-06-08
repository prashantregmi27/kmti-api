import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    image:     { type: String, required: true },
    title:     { type: String, default: '' },
    desc:      { type: String, default: '' },
    category:  { type: String, enum: ['campus', 'events', 'activities', 'results'], default: 'campus' },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);
