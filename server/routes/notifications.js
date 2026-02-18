const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

// All notification routes require authentication
router.use(protect);

// GET /api/notifications - Get all notifications for logged-in user
router.get('/', getNotifications);

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', markAllAsRead);

// PATCH /api/notifications/:id/read - Mark single as read
router.patch('/:id/read', markAsRead);

module.exports = router;
