/**
 * Script to migrate products from JSON file to MongoDB
 * 
 * Usage:
 *   node server/scripts/migrate-products-to-mongo.js
 * 
 * Make sure MONGODB_URI is set in your environment
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllProducts as getMongoProducts, saveProduct as saveMongoProduct } from '../models/productModelMongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrateProducts() {
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

    // Read products from JSON file
    const productsJsonPath = join(__dirname, '../../server/data/products.json');
    console.log(`📖 Reading products from: ${productsJsonPath}`);
    
    const jsonData = await readFile(productsJsonPath, 'utf-8');
    const productsFromJson = JSON.parse(jsonData);
    console.log(`📦 Found ${productsFromJson.length} products in JSON file`);

    // Get existing products from MongoDB
    console.log('🔍 Checking existing products in MongoDB...');
    const existingProducts = await getMongoProducts();
    const existingIds = new Set(existingProducts.map(p => p.id));
    console.log(`📊 Found ${existingProducts.length} existing products in MongoDB`);

    // Migrate products
    let migrated = 0;
    let skipped = 0;
    let errors = [];

    console.log('🚀 Starting migration...');
    for (const product of productsFromJson) {
      try {
        // Skip if product already exists
        if (existingIds.has(product.id)) {
          console.log(`⏭️  Skipping ${product.name} (already exists)`);
          skipped++;
          continue;
        }

        // Save to MongoDB
        await saveMongoProduct(product);
        console.log(`✅ Migrated: ${product.name}`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating ${product.name}:`, error.message);
        errors.push({ id: product.id, name: product.name, error: error.message });
      }
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`   Total products: ${productsFromJson.length}`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(err => {
        console.log(`   - ${err.name} (${err.id}): ${err.error}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateProducts();

