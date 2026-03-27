import { v4 as uuidv4 } from 'uuid';
import {
  getAllNotifications as getAllNotificationsModel,
  getNotificationById as getNotificationByIdModel,
  getNotificationsByUserId,
  getUnreadNotificationsByUserId,
  saveNotification as saveNotificationModel,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearNotificationsByUserId
} from '../models/notificationModel.js';

// Get all notifications (with filters)
export const getAllNotifications = async (req, res) => {
  try {
    const { userId, read, type } = req.query;
    let notifications = await getAllNotificationsModel();

    // Filter by userId
    if (userId) {
      notifications = notifications.filter(notification => notification.userId === userId);
    }

    // Filter by read status
    if (read !== undefined) {
      const isRead = read === 'true';
      notifications = notifications.filter(notification => notification.read === isRead);
    }

    // Filter by type
    if (type && type !== 'all') {
      notifications = notifications.filter(notification => notification.type === type);
    }

    // Sort by createdAt (newest first)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data notifications' });
  }
};

// Get notifications by user ID
export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { read, limit } = req.query;

    let notifications = await getNotificationsByUserId(userId);

    // Filter by read status
    if (read !== undefined) {
      const isRead = read === 'true';
      notifications = notifications.filter(notification => notification.read === isRead);
    }

    // Sort by createdAt (newest first)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Limit results
    if (limit) {
      notifications = notifications.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications by user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data notifications' });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadNotifications = await getUnreadNotificationsByUserId(userId);

    res.json({
      success: true,
      count: unreadNotifications.length
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil unread count' });
  }
};

// Create notification
export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, orderId, status } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: 'Data notification tidak lengkap' });
    }

    const newNotification = {
      id: uuidv4(),
      userId,
      type,
      title,
      message,
      orderId: orderId || null,
      status: status || 'pending',
      read: false,
      createdAt: new Date().toISOString()
    };

    const savedNotification = await saveNotificationModel(newNotification);

    res.status(201).json({
      success: true,
      message: 'Notification berhasil dibuat',
      data: savedNotification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat notification' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNotification = await markNotificationAsRead(id);

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Notification berhasil ditandai sebagai dibaca',
      data: updatedNotification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat update notification' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedNotifications = await markAllNotificationsAsRead(userId);

    res.json({
      success: true,
      message: 'Semua notification berhasil ditandai sebagai dibaca',
      count: updatedNotifications.length,
      data: updatedNotifications
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat update notifications' });
  }
};

// Delete notification
export const deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteNotification(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Notification tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Notification berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus notification' });
  }
};

// Clear all notifications
export const clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    await clearNotificationsByUserId(userId);

    res.json({
      success: true,
      message: 'Semua notification berhasil dihapus'
    });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus notifications' });
  }
};

