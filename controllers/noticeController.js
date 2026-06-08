import Notice from '../models/Notice.js';

export const getNotices = async (req, res) => {
  try {
    const isAdmin = req.query.all === 'true';
    const filter = isAdmin ? {} : { isActive: true };
    let query = Notice.find(filter).sort({ createdAt: -1 });
    if (!isAdmin) query = query.limit(10);
    const notices = await query;
    res.json({ success: true, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json({ success: true, data: notice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
