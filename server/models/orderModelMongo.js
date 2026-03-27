import mongoose from 'mongoose';

// Schema untuk Order
const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  umkmId: { type: String, required: true },
  storeName: { type: String, required: true },
  storeAddress: { type: String, default: null },
  items: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  notes: { type: String, default: null },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'preparing', 'ready', 'picked_up', 'on_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  driverId: { type: String, default: null },
  driverName: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: false
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    mongoUri = mongoUri.trim();
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error(`Invalid MongoDB URI scheme. URI must start with "mongodb://" or "mongodb+srv://". Got: ${mongoUri.substring(0, 20)}...`);
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    isConnected = true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

export async function getAllOrders() {
  await connectDB();
  return await Order.find({}).lean();
}

export async function getOrderById(id) {
  await connectDB();
  return await Order.findOne({ id }).lean();
}

export async function getOrdersByUserId(userId) {
  await connectDB();
  return await Order.find({ userId }).lean();
}

export async function getOrdersByUMKMId(umkmId) {
  await connectDB();
  return await Order.find({ umkmId }).lean();
}

export async function getOrdersByDriverId(driverId) {
  await connectDB();
  return await Order.find({ driverId }).lean();
}

export async function getOrdersByStatus(status) {
  await connectDB();
  return await Order.find({ status }).lean();
}

export async function saveOrder(newOrder) {
  await connectDB();
  const order = new Order(newOrder);
  await order.save();
  return order.toObject();
}

export async function updateOrder(id, updates) {
  await connectDB();
  updates.updatedAt = new Date();
  const order = await Order.findOneAndUpdate({ id }, updates, { new: true }).lean();
  if (!order) {
    throw new Error('Order tidak ditemukan');
  }
  return order;
}

export async function deleteOrder(id) {
  await connectDB();
  const result = await Order.deleteOne({ id });
  return result.deletedCount > 0;
}

