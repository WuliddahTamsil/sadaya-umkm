import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  orderId: { type: String, default: null },
  status: { type: String, default: 'pending' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null }
}, { timestamps: false });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    const mongoUri = process.env.MONGODB_URI?.trim();
    if (!mongoUri) throw new Error('MONGODB_URI not set');
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI');
    }
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000, maxPoolSize: 10 });
    isConnected = true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

export async function getAllNotifications() {
  await connectDB();
  return await Notification.find({}).lean();
}

export async function getNotificationById(id) {
  await connectDB();
  return await Notification.findOne({ id }).lean();
}

export async function getNotificationsByUserId(userId) {
  await connectDB();
  return await Notification.find({ userId }).lean();
}

export async function saveNotification(newNotification) {
  await connectDB();
  const notification = new Notification(newNotification);
  await notification.save();
  return notification.toObject();
}

export async function updateNotification(id, updates) {
  await connectDB();
  const notification = await Notification.findOneAndUpdate({ id }, updates, { new: true }).lean();
  if (!notification) throw new Error('Notification tidak ditemukan');
  return notification;
}

export async function deleteNotification(id) {
  await connectDB();
  const result = await Notification.deleteOne({ id });
  return result.deletedCount > 0;
}

export async function getUnreadNotificationsByUserId(userId) {
  await connectDB();
  return await Notification.find({ userId, read: false }).lean();
}

export async function markNotificationAsRead(id) {
  await connectDB();
  const notification = await Notification.findOneAndUpdate(
    { id },
    { read: true, readAt: new Date() },
    { new: true }
  ).lean();
  if (!notification) return null;
  return notification;
}

export async function markAllNotificationsAsRead(userId) {
  await connectDB();
  await Notification.updateMany(
    { userId, read: false },
    { read: true, readAt: new Date() }
  );
  return await Notification.find({ userId }).lean();
}

export async function clearNotificationsByUserId(userId) {
  await connectDB();
  const result = await Notification.deleteMany({ userId });
  return result.deletedCount > 0;
}

