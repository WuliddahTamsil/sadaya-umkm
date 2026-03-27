/**
 * Script to migrate orders from JSON file to MongoDB
 *
 * Usage:
 *   node server/scripts/migrate-orders-to-mongo.js
 *
 * Make sure MONGODB_URI is set in your environment
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllOrders as getMongoOrders, saveOrder as saveMongoOrder } from '../models/orderModelMongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrateOrders() {
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

    // Read orders from JSON file
    const ordersJsonPath = join(__dirname, '../../server/data/orders.json');
    console.log(`📖 Reading orders from: ${ordersJsonPath}`);

    const jsonData = await readFile(ordersJsonPath, 'utf-8');
    const ordersFromJson = JSON.parse(jsonData);
    console.log(`📦 Found ${ordersFromJson.length} orders in JSON file`);

    // Get existing orders from MongoDB
    console.log('🔍 Checking existing orders in MongoDB...');
    const existingOrders = await getMongoOrders();
    const existingIds = new Set(existingOrders.map(o => o.id));
    console.log(`📊 Found ${existingOrders.length} existing orders in MongoDB`);

    // Migrate orders
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🚀 Starting migration...');
    for (const order of ordersFromJson) {
      try {
        if (existingIds.has(order.id)) {
          console.log(`⏭️  Skipped: ${order.id} - already exists`);
          skipped++;
          continue;
        }

        await saveMongoOrder(order);
        console.log(`✅ Migrated: ${order.id}`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating order ${order.id}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Total orders: ${ordersFromJson.length}`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);

    if (migrated > 0 || skipped > 0) {
      console.log('✅ Migration completed!');
    } else {
      console.log('ℹ️  No orders to migrate');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateOrders();