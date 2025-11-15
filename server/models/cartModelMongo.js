import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  id_user: { type: String, required: true },
  id_produk: { type: String, required: true },
  jumlah: { type: Number, required: true, default: 1 },
  harga_saat_ini: { type: Number, required: true },
  tanggal_ditambahkan: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

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

export async function getCartByUserId(userId) {
  await connectDB();
  return await Cart.find({ id_user: userId }).lean();
}

export async function getCartItemById(id) {
  await connectDB();
  return await Cart.findOne({ id }).lean();
}

export async function saveCartItem(newItem) {
  await connectDB();
  const item = new Cart(newItem);
  await item.save();
  return item.toObject();
}

export async function updateCartItem(id, updates) {
  await connectDB();
  updates.updatedAt = new Date();
  const item = await Cart.findOneAndUpdate({ id }, updates, { new: true }).lean();
  if (!item) throw new Error('Cart item tidak ditemukan');
  return item;
}

export async function deleteCartItem(id) {
  await connectDB();
  const result = await Cart.deleteOne({ id });
  return result.deletedCount > 0;
}

export async function deleteCartByUserId(userId) {
  await connectDB();
  const result = await Cart.deleteMany({ id_user: userId });
  return result.deletedCount;
}

// Add to cart (jika produk sudah ada, tambah jumlahnya)
export async function addToCart(userId, productId, quantity, currentPrice) {
  await connectDB();
  const existingItem = await Cart.findOne({ id_user: userId, id_produk: productId });
  
  if (existingItem) {
    existingItem.jumlah += quantity;
    existingItem.harga_saat_ini = currentPrice;
    existingItem.updatedAt = new Date();
    await existingItem.save();
    return existingItem.toObject();
  } else {
    const newItem = new Cart({
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      id_user: userId,
      id_produk: productId,
      jumlah: quantity,
      harga_saat_ini: currentPrice,
      tanggal_ditambahkan: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await newItem.save();
    return newItem.toObject();
  }
}

