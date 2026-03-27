import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);

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

export async function getWalletByUserId(userId) {
  await connectDB();
  let wallet = await Wallet.findOne({ userId }).lean();
  if (!wallet) {
    wallet = await Wallet.create({ userId, balance: 0 });
    return wallet.toObject();
  }
  return wallet;
}

export async function updateWalletBalance(userId, amount, operation = 'add') {
  await connectDB();
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId, balance: 0 });
  }
  
  if (operation === 'add') {
    wallet.balance += amount;
  } else if (operation === 'subtract') {
    wallet.balance -= amount;
  } else if (operation === 'set') {
    wallet.balance = amount;
  }
  
  wallet.updatedAt = new Date();
  await wallet.save();
  return wallet.toObject();
}

