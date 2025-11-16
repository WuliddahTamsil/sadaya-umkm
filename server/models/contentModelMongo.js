import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  author: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, default: 'draft', enum: ['draft', 'published'] },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  thumbnail: { type: String, default: null },
  category: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

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

export async function getAllContents() {
  await connectDB();
  return await Content.find({}).lean();
}

export async function getPublishedContents() {
  await connectDB();
  return await Content.find({ status: 'published' }).lean();
}

export async function getContentById(id) {
  await connectDB();
  return await Content.findOne({ id }).lean();
}

export async function createContent(contentData) {
  await connectDB();
  const content = new Content({
    id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...contentData,
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await content.save();
  return content.toObject();
}

export async function updateContent(id, updates) {
  await connectDB();
  updates.updatedAt = new Date();
  const content = await Content.findOneAndUpdate({ id }, updates, { new: true }).lean();
  if (!content) return null;
  return content;
}

export async function deleteContent(id) {
  await connectDB();
  const result = await Content.deleteOne({ id });
  return result.deletedCount > 0;
}

export async function incrementViews(id) {
  await connectDB();
  const content = await Content.findOneAndUpdate(
    { id },
    { $inc: { views: 1 }, updatedAt: new Date() },
    { new: true }
  ).lean();
  return content;
}

