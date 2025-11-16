import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, default: null },
  description: { type: String, default: null },
  image: { type: String, default: null },
  umkmId: { type: String, required: true },
  umkmName: { type: String, default: null },
  sold: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

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

export async function getAllProducts() {
  await connectDB();
  return await Product.find({}).lean();
}

export async function getProductById(id) {
  await connectDB();
  return await Product.findOne({ id }).lean();
}

export async function getProductsByUMKM(umkmId) {
  await connectDB();
  return await Product.find({ umkmId }).lean();
}

export async function saveProduct(newProduct) {
  await connectDB();
  const product = new Product(newProduct);
  await product.save();
  return product.toObject();
}

export async function updateProduct(id, updates) {
  await connectDB();
  updates.updatedAt = new Date();
  const product = await Product.findOneAndUpdate({ id }, updates, { new: true }).lean();
  if (!product) throw new Error('Produk tidak ditemukan');
  return product;
}

export async function deleteProduct(id) {
  await connectDB();
  const result = await Product.deleteOne({ id });
  return result.deletedCount > 0;
}

