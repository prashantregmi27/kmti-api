import express from 'express';
import { createEnrollment, getEnrollments, updateEnrollmentStatus, deleteEnrollment } from '../controllers/enrollmentController.js';
import { createContact, getContacts } from '../controllers/contactController.js';
import { getNotices, createNotice, deleteNotice } from '../controllers/noticeController.js';
import { login, verifyToken } from '../controllers/authController.js';
import { getStats } from '../controllers/statsController.js';
import { getSettings, updateSetting, updateSettings } from '../controllers/settingsController.js';
import { upload, uploadFile } from '../controllers/uploadController.js';
import { getSiteContent, updateSiteContent } from '../controllers/siteContentController.js';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';

const router = express.Router();

// ── Auth ────────────────────────────────────────────
router.post('/auth/login', login);

// ── Stats (protected) ───────────────────────────────
router.get('/stats', verifyToken, getStats);

// ── Settings (public read, protected write) ─────────
router.get('/settings', getSettings);
router.put('/settings', verifyToken, updateSetting);
router.put('/settings/bulk', verifyToken, updateSettings);

// ── Upload (protected) ──────────────────────────────
router.post('/upload', verifyToken, upload.single('file'), uploadFile);

// ── Enrollment Routes ──────────────────────────────
router.post('/enrollments', createEnrollment);
router.get('/enrollments', verifyToken, getEnrollments);
router.patch('/enrollments/:id', verifyToken, updateEnrollmentStatus);
router.delete('/enrollments/:id', verifyToken, deleteEnrollment);

// ── Contact Routes ─────────────────────────────────
router.post('/contact', createContact);
router.get('/contact', verifyToken, getContacts);

// ── Notice Routes ──────────────────────────────────
router.get('/notices', getNotices);
router.post('/notices', verifyToken, createNotice);
router.delete('/notices/:id', verifyToken, deleteNotice);

// ── Site Content Routes ────────────────────────────
router.get('/site-content', getSiteContent);
router.put('/site-content/:section', verifyToken, updateSiteContent);

// ── Gallery Routes ─────────────────────────────────
router.get('/gallery', getGallery);
router.post('/gallery', verifyToken, createGalleryItem);
router.delete('/gallery/:id', verifyToken, deleteGalleryItem);

export default router;
