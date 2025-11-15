import express from 'express';
import {
  getAllNotifications,
  getNotificationsByUser,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotificationById,
  clearAllNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

// GET /api/notifications - Get all notifications (with filters: userId, read, type)
router.get('/', getAllNotifications);

// GET /api/notifications/user/:userId - Get notifications by user ID
router.get('/user/:userId', getNotificationsByUser);

// GET /api/notifications/user/:userId/unread-count - Get unread count
router.get('/user/:userId/unread-count', getUnreadCount);

// POST /api/notifications - Create notification
router.post('/', createNotification);

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', markAsRead);

// PATCH /api/notifications/user/:userId/read-all - Mark all notifications as read
router.patch('/user/:userId/read-all', markAllAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', deleteNotificationById);

// DELETE /api/notifications/user/:userId - Clear all notifications
router.delete('/user/:userId', clearAllNotifications);

export default router;

