import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  contentId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userRole: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

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

export async function getCommentsByContentId(contentId) {
  await connectDB();
  return await Comment.find({ contentId }).sort({ createdAt: -1 }).lean();
}

export async function createComment(commentData) {
  await connectDB();
  const comment = new Comment({
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...commentData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await comment.save();
  return comment.toObject();
}

export async function deleteComment(id) {
  await connectDB();
  const result = await Comment.deleteOne({ id });
  return result.deletedCount > 0;
}

export async function updateCommentCount(contentId) {
  await connectDB();
  const count = await Comment.countDocuments({ contentId });
  // Update content comments count
  const Content = mongoose.models.Content || mongoose.model('Content', mongoose.Schema({}, { strict: false }));
  await Content.findOneAndUpdate(
    { id: contentId },
    { $set: { comments: count, updatedAt: new Date() } }
  );
  return count;
}

