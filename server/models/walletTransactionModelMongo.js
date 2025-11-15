import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const walletTransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, required: true, enum: ['topup', 'payment', 'refund'] },
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  orderId: { type: String, default: null },
  status: { type: String, default: 'completed', enum: ['completed', 'pending', 'failed'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

const WalletTransaction = mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', walletTransactionSchema);

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

export async function getTransactionsByUserId(userId) {
  await connectDB();
  return await WalletTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
}

export async function createTransaction(transactionData) {
  await connectDB();
  const transaction = new WalletTransaction({
    id: uuidv4(),
    ...transactionData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await transaction.save();
  return transaction.toObject();
}

