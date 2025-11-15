import mongoose from 'mongoose';

// Schema untuk User
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user', 'umkm', 'driver'] },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  description: { type: String, default: null },
  status: { type: String, default: 'active', enum: ['active', 'pending', 'suspended'] },
  isVerified: { type: Boolean, default: false },
  isOnboarded: { type: Boolean, default: false },
  joinDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  totalOrders: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Fields khusus UMKM
  storeName: { type: String, default: null },
  storeAddress: { type: String, default: null },
  storeDescription: { type: String, default: null },
  ktpFile: { type: String, default: null },
  storePhotoFile: { type: String, default: null },
  businessPermitFile: { type: String, default: null },
  // Fields khusus Driver
  vehicleType: { type: String, default: null },
  vehiclePlate: { type: String, default: null },
  simFile: { type: String, default: null },
  stnkFile: { type: String, default: null },
  selfieFile: { type: String, default: null },
  vehiclePhotoFile: { type: String, default: null }
}, {
  timestamps: false // Kita handle manual
});

// Model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Connect to MongoDB
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoUri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
    
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully');
    console.log('Database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    isConnected = false;
    throw error;
  }
}

// Get all users
export async function getAllUsers() {
  await connectDB();
  const users = await User.find({}).lean();
  return users;
}

// Get user by ID
export async function getUserById(id) {
  await connectDB();
  const user = await User.findOne({ id }).lean();
  return user;
}

// Get user by email
export async function getUserByEmail(email) {
  await connectDB();
  const user = await User.findOne({ email }).lean();
  return user;
}

// Save new user
export async function saveUser(newUser) {
  await connectDB();
  const user = new User(newUser);
  await user.save();
  return user.toObject();
}

// Update user
export async function updateUser(id, updates) {
  await connectDB();
  updates.updatedAt = new Date();
  const user = await User.findOneAndUpdate(
    { id },
    updates,
    { new: true, lean: true }
  );
  
  if (!user) {
    throw new Error('User tidak ditemukan');
  }
  
  return user;
}

// Delete user
export async function deleteUser(id) {
  await connectDB();
  const result = await User.deleteOne({ id });
  return result.deletedCount > 0;
}

