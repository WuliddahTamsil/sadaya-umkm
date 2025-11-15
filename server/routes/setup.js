import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const router = express.Router();

// User Schema
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

// Setup admin user - Hanya bisa dipanggil sekali atau untuk update password
router.post('/setup-admin', async (req, res) => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return res.status(500).json({ error: 'MONGODB_URI not configured' });
    }

    // Connect
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri.trim(), {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
    }

    // Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

    // Generate password hash untuk "123123"
    const passwordHash = await bcrypt.hash('123123', 10);

    const adminData = {
      id: 'admin-001',
      name: 'Admin Asli Bogor',
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
      existingAdmin.password = passwordHash;
      existingAdmin.updatedAt = new Date();
      await existingAdmin.save();
      
      return res.json({
        success: true,
        message: 'Admin password updated successfully!',
        email: 'admin@gmail.com',
        password: '123123'
      });
    } else {
      // Buat admin baru
      const admin = new User(adminData);
      await admin.save();
      
      return res.json({
        success: true,
        message: 'Admin user created successfully!',
        email: 'admin@gmail.com',
        password: '123123'
      });
    }
  } catch (error) {
    console.error('Setup admin error:', error);
    return res.status(500).json({
      error: 'Failed to setup admin',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

