import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Jika MONGODB_URI ada, gunakan MongoDB, jika tidak gunakan file JSON
const useMongoDB = !!process.env.MONGODB_URI;

// Lazy load MongoDB model
let mongoNotificationModelPromise = null;
async function getMongoModel() {
  if (!useMongoDB) return null;
  if (!mongoNotificationModelPromise) {
    mongoNotificationModelPromise = import('./notificationModelMongo.js').then(module => {
      console.log('✅ Using MongoDB for notification storage');
      return module;
    }).catch(error => {
      console.warn('⚠️ MongoDB import failed, falling back to JSON file:', error.message);
      return null;
    });
  }
  return await mongoNotificationModelPromise;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/notifications.json');

// Helper function untuk membaca data dari file
async function readNotifications() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Jika file tidak ada, return array kosong
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function untuk menulis data ke file
async function writeNotifications(notifications) {
  await writeFile(DATA_FILE, JSON.stringify(notifications, null, 2), 'utf-8');
}

// Get all notifications
export async function getAllNotifications() {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getAllNotifications();
  }
  return await readNotifications();
}

// Get notification by ID
export async function getNotificationById(id) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getNotificationById(id);
  }
  const notifications = await readNotifications();
  return notifications.find(notification => notification.id === id);
}

// Get notifications by user ID
export async function getNotificationsByUserId(userId) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getNotificationsByUserId(userId);
  }
  const notifications = await readNotifications();
  return notifications.filter(notification => notification.userId === userId);
}

// Get unread notifications by user ID
export async function getUnreadNotificationsByUserId(userId) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getUnreadNotificationsByUserId(userId);
  }
  const notifications = await readNotifications();
  return notifications.filter(notification => 
    notification.userId === userId && !notification.read
  );
}

// Save new notification
export async function saveNotification(newNotification) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.saveNotification(newNotification);
  }
  const notifications = await readNotifications();
  notifications.push(newNotification);
  await writeNotifications(notifications);
  return newNotification;
}

// Mark notification as read
export async function markNotificationAsRead(id) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.markNotificationAsRead(id);
  }
  const notifications = await readNotifications();
  const index = notifications.findIndex(notification => notification.id === id);
  
  if (index === -1) {
    return null;
  }
  
  notifications[index] = {
    ...notifications[index],
    read: true,
    readAt: new Date().toISOString()
  };
  
  await writeNotifications(notifications);
  return notifications[index];
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.markAllNotificationsAsRead(userId);
  }
  const notifications = await readNotifications();
  const updatedNotifications = notifications.map(notification => {
    if (notification.userId === userId && !notification.read) {
      return {
        ...notification,
        read: true,
        readAt: new Date().toISOString()
      };
    }
    return notification;
  });
  
  await writeNotifications(updatedNotifications);
  return updatedNotifications.filter(n => n.userId === userId);
}

// Delete notification
export async function deleteNotification(id) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    const result = await mongoModel.deleteNotification(id);
    return result ? true : null;
  }
  const notifications = await readNotifications();
  const filteredNotifications = notifications.filter(notification => notification.id !== id);
  
  if (filteredNotifications.length === notifications.length) {
    return null; // Notification not found
  }
  
  await writeNotifications(filteredNotifications);
  return true;
}

// Clear all notifications for a user
export async function clearNotificationsByUserId(userId) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    await mongoModel.clearNotificationsByUserId(userId);
    return true;
  }
  const notifications = await readNotifications();
  const filteredNotifications = notifications.filter(notification => notification.userId !== userId);
  
  await writeNotifications(filteredNotifications);
  return true;
}

