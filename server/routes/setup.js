import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllProducts as getMongoProducts, saveProduct as saveMongoProduct } from '../models/productModelMongo.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Migrate products from JSON file to MongoDB
router.post('/migrate-products', async (req, res) => {
  try {
    // Check MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return res.status(500).json({ error: 'MONGODB_URI not configured' });
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri.trim(), {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
    }

    // Read products from JSON file
    const productsJsonPath = join(__dirname, '../data/products.json');
    let productsFromJson = [];
    
    try {
      const jsonData = await readFile(productsJsonPath, 'utf-8');
      productsFromJson = JSON.parse(jsonData);
    } catch (error) {
      console.error('Error reading products.json:', error.message);
      // If file doesn't exist or can't be read (e.g., in Vercel), return error with instructions
      return res.status(404).json({
        error: 'Cannot read products.json file',
        message: 'This endpoint should be called from localhost or provide products data in request body',
        hint: 'You can also POST products array to this endpoint in the request body'
      });
    }

    // Get existing products from MongoDB
    const existingProducts = await getMongoProducts();
    const existingIds = new Set(existingProducts.map(p => p.id));

    // Migrate products
    let migrated = 0;
    let skipped = 0;
    let errors = [];

    for (const product of productsFromJson) {
      try {
        // Skip if product already exists
        if (existingIds.has(product.id)) {
          skipped++;
          continue;
        }

        // Save to MongoDB
        await saveMongoProduct(product);
        migrated++;
      } catch (error) {
        console.error(`Error migrating product ${product.id}:`, error.message);
        errors.push({ id: product.id, name: product.name, error: error.message });
      }
    }

    return res.json({
      success: true,
      message: 'Product migration completed',
      stats: {
        total: productsFromJson.length,
        migrated,
        skipped,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Migrate products error:', error);
    return res.status(500).json({
      error: 'Failed to migrate products',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Alternative: Accept products in request body for migration (works in Vercel)
router.post('/migrate-products-from-body', async (req, res) => {
  try {
    // Check MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return res.status(500).json({ error: 'MONGODB_URI not configured' });
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri.trim(), {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
    }

    // Get products from request body
    const productsFromBody = req.body.products || req.body;
    
    if (!Array.isArray(productsFromBody)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }

    // Get existing products from MongoDB
    const existingProducts = await getMongoProducts();
    const existingIds = new Set(existingProducts.map(p => p.id));

    // Migrate products
    let migrated = 0;
    let skipped = 0;
    let errors = [];

    for (const product of productsFromBody) {
      try {
        // Skip if product already exists
        if (existingIds.has(product.id)) {
          skipped++;
          continue;
        }

        // Save to MongoDB
        await saveMongoProduct(product);
        migrated++;
      } catch (error) {
        console.error(`Error migrating product ${product.id}:`, error.message);
        errors.push({ id: product.id, name: product.name, error: error.message });
      }
    }

    return res.json({
      success: true,
      message: 'Product migration completed',
      stats: {
        total: productsFromBody.length,
        migrated,
        skipped,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Migrate products error:', error);
    return res.status(500).json({
      error: 'Failed to migrate products',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

