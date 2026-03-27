import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User Schema (sama dengan userModelMongo.js)
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
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: false
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function setupAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri.trim(), {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    // Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

    // Generate password hash untuk "123123"
    const passwordHash = await bcrypt.hash('123123', 10);
    console.log('🔑 Generated password hash for "123123"');

    const adminData = {
      id: 'admin-001',
      name: 'Admin SADAYA',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: 'admin',
      phone: null,
      address: null,
      description: null,
      status: 'active',
      isVerified: true,
      isOnboarded: true,
      joinDate: '2025-01-01',
      totalOrders: 0,
      rating: 0,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date()
    };

    if (existingAdmin) {
      // Update admin jika sudah ada
      console.log('📝 Admin user already exists, updating password...');
      existingAdmin.password = passwordHash;
      existingAdmin.updatedAt = new Date();
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully!');
    } else {
      // Buat admin baru
      console.log('➕ Creating new admin user...');
      const admin = new User(adminData);
      await admin.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: 123123');
    console.log('   Role: admin\n');

    await mongoose.connection.close();
    console.log('✅ Setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupAdmin();

