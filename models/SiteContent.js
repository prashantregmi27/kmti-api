import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema(
  {
    section:     { type: String, unique: true, required: true },
    title:       { type: String, default: '' },
    subtitle:    { type: String, default: '' },
    description: { type: String, default: '' },
    image:       { type: String, default: '' },
    buttonText:  { type: String, default: '' },
    buttonLink:  { type: String, default: '' },
    content:     { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('SiteContent', siteContentSchema);
