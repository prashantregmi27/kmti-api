import Enrollment from '../models/Enrollment.js';
import { sendEnrollmentEmail } from '../utils/mailer.js';

// @desc   Submit enrollment application
// @route  POST /api/enrollments
export const createEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    const emailResult = await sendEnrollmentEmail(req.body);
    res.status(201).json({
      success: true,
      message: emailResult
        ? 'Enrollment submitted successfully! A confirmation email has been sent to your email.'
        : 'Enrollment submitted successfully! (Could not send confirmation email, but we have your application.)',
      data: enrollment,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc   Get all enrollments (admin)
// @route  GET /api/enrollments
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update enrollment status (admin)
// @route  PATCH /api/enrollments/:id
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    res.json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Delete enrollment (admin)
// @route  DELETE /api/enrollments/:id
export const deleteEnrollment = async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Enrollment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
