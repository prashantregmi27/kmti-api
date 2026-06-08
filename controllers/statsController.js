import Enrollment from '../models/Enrollment.js';
import Contact from '../models/Contact.js';
import Notice from '../models/Notice.js';

export const getStats = async (req, res) => {
  try {
    const [
      totalEnrollments,
      totalContacts,
      totalNotices,
      recentEnrollments,
      recentContacts,
      statusCounts,
    ] = await Promise.all([
      Enrollment.countDocuments(),
      Contact.countDocuments(),
      Notice.countDocuments({ isActive: true }),
      Enrollment.find().sort({ createdAt: -1 }).limit(5).lean(),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      Enrollment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const enrollmentsByStatus = { Pending: 0, Reviewed: 0, Accepted: 0, Rejected: 0 };
    statusCounts.forEach(({ _id, count }) => { enrollmentsByStatus[_id] = count; });

    const enrollmentsByDate = await Enrollment.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 14 },
    ]);

    res.json({
      success: true,
      data: {
        totalEnrollments,
        totalContacts,
        totalNotices,
        enrollmentsByStatus,
        enrollmentsByDate: enrollmentsByDate.reverse(),
        recentEnrollments,
        recentContacts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
