import {
  findManyAcrossDatabases,
  findOneAcrossDatabases,
  upsertAcrossDatabases,
  deleteAcrossDatabases
} from './mongoMultiDb.js';

const COLLECTION = 'notifications';

function stripSourceDatabase(document) {
  if (!document) return document;
  const { _sourceDatabase, ...rest } = document;
  return rest;
}

export async function getAllNotifications() {
  const notifications = await findManyAcrossDatabases(COLLECTION, {}, {
    dedupeKeys: ['id', '_id'],
    sort: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  });
  return notifications.map(stripSourceDatabase);
}

export async function getNotificationById(id) {
  const notification = await findOneAcrossDatabases(COLLECTION, { id }, {
    dedupeKeys: ['id', '_id']
  });
  return stripSourceDatabase(notification);
}

export async function getNotificationsByUserId(userId) {
  const notifications = await findManyAcrossDatabases(COLLECTION, { userId }, {
    dedupeKeys: ['id', '_id'],
    sort: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  });
  return notifications.map(stripSourceDatabase);
}

export async function saveNotification(newNotification) {
  await upsertAcrossDatabases(COLLECTION, { id: newNotification.id }, newNotification);
  return newNotification;
}

export async function updateNotification(id, updates) {
  const existingNotification = await getNotificationById(id);
  if (!existingNotification) {
    throw new Error('Notification tidak ditemukan');
  }

  const updatedNotification = {
    ...existingNotification,
    ...updates
  };

  await upsertAcrossDatabases(COLLECTION, { id: existingNotification.id }, updatedNotification);
  return updatedNotification;
}

export async function deleteNotification(id) {
  const deletedCount = await deleteAcrossDatabases(COLLECTION, { id });
  return deletedCount > 0;
}

export async function getUnreadNotificationsByUserId(userId) {
  const notifications = await findManyAcrossDatabases(COLLECTION, { userId, read: false }, {
    dedupeKeys: ['id', '_id'],
    sort: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  });
  return notifications.map(stripSourceDatabase);
}

export async function markNotificationAsRead(id) {
  const existingNotification = await getNotificationById(id);
  if (!existingNotification) return null;

  const updatedNotification = {
    ...existingNotification,
    read: true,
    readAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: existingNotification.id }, updatedNotification);
  return updatedNotification;
}

export async function markAllNotificationsAsRead(userId) {
  const notifications = await getNotificationsByUserId(userId);
  await Promise.all(
    notifications.map((notification) =>
      upsertAcrossDatabases(COLLECTION, { id: notification.id }, {
        ...notification,
        read: true,
        readAt: notification.readAt || new Date()
      })
    )
  );

  return await getNotificationsByUserId(userId);
}

export async function clearNotificationsByUserId(userId) {
  const deletedCount = await deleteAcrossDatabases(COLLECTION, { userId });
  return deletedCount > 0;
}
