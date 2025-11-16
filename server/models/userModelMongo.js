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
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Trim whitespace and validate
    mongoUri = mongoUri.trim();
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error(`Invalid MongoDB URI scheme. URI must start with "mongodb://" or "mongodb+srv://". Got: ${mongoUri.substring(0, 20)}...`);
    }

    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('MongoDB URI (first 50 chars):', mongoUri.substring(0, 50) + '...');
    console.log('MongoDB URI starts with:', mongoUri.substring(0, 15));
    
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
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
  
  // Pastikan ID tidak diubah atau dihapus dari updates
  if (updates.id && updates.id !== id) {
    console.warn('⚠️ Attempted to change user ID, ignoring...');
    delete updates.id;
  }
  
  // Hapus field undefined agar MongoDB tidak mengabaikan update
  // Tapi tetap simpan field-file meskipun string kosong (untuk overwrite)
  const cleanUpdates = {};
  for (const [key, value] of Object.entries(updates)) {
    // Simpan semua field yang bukan undefined
    // Termasuk string kosong untuk field-file (bisa jadi URL kosong)
    if (value !== undefined) {
      cleanUpdates[key] = value;
    }
  }
  
  // Pastikan updatedAt selalu di-update
  cleanUpdates.updatedAt = new Date();
  
  console.log('🔄 Updating user:', id);
  console.log('📝 Updates keys:', Object.keys(cleanUpdates));
  console.log('📝 File fields in updates:', {
    ktpFile: cleanUpdates.ktpFile ? `✅ ${cleanUpdates.ktpFile.substring(0, 50)}...` : '❌ not in updates',
    simFile: cleanUpdates.simFile ? `✅ ${cleanUpdates.simFile.substring(0, 50)}...` : '❌ not in updates',
    stnkFile: cleanUpdates.stnkFile ? `✅ ${cleanUpdates.stnkFile.substring(0, 50)}...` : '❌ not in updates',
    selfieFile: cleanUpdates.selfieFile ? `✅ ${cleanUpdates.selfieFile.substring(0, 50)}...` : '❌ not in updates',
    vehiclePhotoFile: cleanUpdates.vehiclePhotoFile ? `✅ ${cleanUpdates.vehiclePhotoFile.substring(0, 50)}...` : '❌ not in updates',
    storePhotoFile: cleanUpdates.storePhotoFile ? `✅ ${cleanUpdates.storePhotoFile.substring(0, 50)}...` : '❌ not in updates',
    businessPermitFile: cleanUpdates.businessPermitFile ? `✅ ${cleanUpdates.businessPermitFile.substring(0, 50)}...` : '❌ not in updates'
  });
  
  // PASTIKAN field-file tersimpan dengan benar
  // Gunakan $set untuk memastikan semua field ter-update
  const updateQuery = { $set: cleanUpdates };
  
  console.log('🔄 MongoDB update query:', JSON.stringify(updateQuery, null, 2));
  console.log('🔄 File fields in cleanUpdates:', {
    ktpFile: cleanUpdates.ktpFile ? `✅ ${cleanUpdates.ktpFile.substring(0, 50)}...` : '❌ not in cleanUpdates',
    simFile: cleanUpdates.simFile ? `✅ ${cleanUpdates.simFile.substring(0, 50)}...` : '❌ not in cleanUpdates',
    stnkFile: cleanUpdates.stnkFile ? `✅ ${cleanUpdates.stnkFile.substring(0, 50)}...` : '❌ not in cleanUpdates',
    selfieFile: cleanUpdates.selfieFile ? `✅ ${cleanUpdates.selfieFile.substring(0, 50)}...` : '❌ not in cleanUpdates',
    vehiclePhotoFile: cleanUpdates.vehiclePhotoFile ? `✅ ${cleanUpdates.vehiclePhotoFile.substring(0, 50)}...` : '❌ not in cleanUpdates',
    storePhotoFile: cleanUpdates.storePhotoFile ? `✅ ${cleanUpdates.storePhotoFile.substring(0, 50)}...` : '❌ not in cleanUpdates',
    businessPermitFile: cleanUpdates.businessPermitFile ? `✅ ${cleanUpdates.businessPermitFile.substring(0, 50)}...` : '❌ not in cleanUpdates'
  });
  
  const user = await User.findOneAndUpdate(
    { id }, // Cari berdasarkan id (bukan _id MongoDB)
    updateQuery, // Gunakan $set untuk memastikan semua field ter-update, termasuk file URLs
    { 
      new: true, // Return document setelah update
      lean: true, // Return plain object, bukan Mongoose document
      runValidators: false, // Skip validation untuk menghindari error pada update
      upsert: false // Jangan buat document baru jika tidak ada
    }
  );
  
  if (!user) {
    throw new Error(`User dengan ID ${id} tidak ditemukan`);
  }
  
  // Verifikasi bahwa field-file benar-benar tersimpan
  console.log('✅ User updated successfully');
  console.log('📋 User ID after update:', user.id);
  console.log('📋 All user fields:', Object.keys(user));
  console.log('📋 File fields after update:', {
    ktpFile: user.ktpFile ? `✅ ${user.ktpFile.substring(0, 50)}...` : '❌ null/undefined',
    simFile: user.simFile ? `✅ ${user.simFile ? user.simFile.substring(0, 50) + '...' : 'null/undefined'}` : '❌ null/undefined',
    stnkFile: user.stnkFile ? `✅ ${user.stnkFile ? user.stnkFile.substring(0, 50) + '...' : 'null/undefined'}` : '❌ null/undefined',
    selfieFile: user.selfieFile ? `✅ ${user.selfieFile ? user.selfieFile.substring(0, 50) + '...' : 'null/undefined'}` : '❌ null/undefined',
    vehiclePhotoFile: user.vehiclePhotoFile ? `✅ ${user.vehiclePhotoFile ? user.vehiclePhotoFile.substring(0, 50) + '...' : 'null/undefined'}` : '❌ null/undefined',
    storePhotoFile: user.storePhotoFile ? `✅ ${user.storePhotoFile.substring(0, 50)}...` : '❌ null/undefined',
    businessPermitFile: user.businessPermitFile ? `✅ ${user.businessPermitFile.substring(0, 50)}...` : '❌ null/undefined'
  });
  
  // Jika field-file tidak tersimpan padahal ada di cleanUpdates, throw error
  if (cleanUpdates.ktpFile && !user.ktpFile) {
    console.error('❌ CRITICAL: ktpFile tidak tersimpan padahal ada di cleanUpdates!');
  }
  if (cleanUpdates.storePhotoFile && !user.storePhotoFile) {
    console.error('❌ CRITICAL: storePhotoFile tidak tersimpan padahal ada di cleanUpdates!');
  }
  if (cleanUpdates.businessPermitFile && !user.businessPermitFile) {
    console.error('❌ CRITICAL: businessPermitFile tidak tersimpan padahal ada di cleanUpdates!');
  }
  
  return user;
}

// Delete user
export async function deleteUser(id) {
  await connectDB();
  const result = await User.deleteOne({ id });
  return result.deletedCount > 0;
}

