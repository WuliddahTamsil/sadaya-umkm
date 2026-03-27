/**
 * Script to migrate carts from JSON file to MongoDB
 *
 * Usage:
 *   node server/scripts/migrate-carts-to-mongo.js
 *
 * Make sure MONGODB_URI is set in your environment
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { saveCartItem } from '../models/cartModelMongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define Cart model locally for migration
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

async function migrateCarts() {
  try {
    // Check MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set in environment variables');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri.trim(), {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    // Read carts from JSON file
    const cartsJsonPath = join(__dirname, '../../server/data/cart.json');
    console.log(`📖 Reading carts from: ${cartsJsonPath}`);

    const jsonData = await readFile(cartsJsonPath, 'utf-8');
    const cartsFromJson = JSON.parse(jsonData);
    console.log(`📦 Found ${cartsFromJson.length} carts in JSON file`);

    // Get existing carts from MongoDB
    console.log('🔍 Checking existing carts in MongoDB...');
    const existingCarts = await Cart.find({}).lean();
    const existingIds = new Set(existingCarts.map(c => c.id));
    console.log(`📊 Found ${existingCarts.length} existing carts in MongoDB`);

    // Migrate carts
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🚀 Starting migration...');
    for (const cart of cartsFromJson) {
      try {
        if (existingIds.has(cart.id)) {
          console.log(`⏭️  Skipped: ${cart.id} - already exists`);
          skipped++;
          continue;
        }

        const item = new Cart(cart);
        await item.save();
        console.log(`✅ Migrated: ${cart.id}`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating cart ${cart.id}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Total carts: ${cartsFromJson.length}`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);

    if (migrated > 0 || skipped > 0) {
      console.log('✅ Migration completed!');
    } else {
      console.log('ℹ️  No carts to migrate');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateCarts();