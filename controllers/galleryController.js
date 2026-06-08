import Gallery from '../models/Gallery.js';

export const getGallery = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    const { image, title, desc, category } = req.body;
    if (!image) return res.status(400).json({ success: false, message: 'Image URL is required' });
    const item = await Gallery.create({ image, title, desc, category });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
