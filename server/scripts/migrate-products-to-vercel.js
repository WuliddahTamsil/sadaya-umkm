/**
 * Script to migrate products from JSON file to MongoDB via Vercel API
 * 
 * Usage:
 *   node server/scripts/migrate-products-to-vercel.js
 * 
 * This script will POST products to your Vercel deployment's migration endpoint
 * Make sure your Vercel app URL is correct below
 */

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Vercel app URL - Change this to your actual Vercel URL
const VERCEL_URL = process.env.VERCEL_URL || 'https://asli-bogor-v3.vercel.app';

async function migrateProductsToVercel() {
  try {
    // Read products from JSON file
    const productsJsonPath = join(__dirname, '../../server/data/products.json');
    console.log(`📖 Reading products from: ${productsJsonPath}`);
    
    const jsonData = await readFile(productsJsonPath, 'utf-8');
    const productsFromJson = JSON.parse(jsonData);
    console.log(`📦 Found ${productsFromJson.length} products in JSON file`);

    // Migration endpoint
    const migrationEndpoint = `${VERCEL_URL}/api/setup/migrate-products-from-body`;
    console.log(`🚀 Migrating to: ${migrationEndpoint}`);

    // POST products to migration endpoint
    const response = await fetch(migrationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productsFromJson),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Migration failed:', result);
      process.exit(1);
    }

    // Display results
    console.log('\n✅ Migration completed!');
    console.log(`📊 Summary:`);
    console.log(`   Total products: ${result.stats?.total || 0}`);
    console.log(`   ✅ Migrated: ${result.stats?.migrated || 0}`);
    console.log(`   ⏭️  Skipped: ${result.stats?.skipped || 0}`);
    console.log(`   ❌ Errors: ${result.stats?.errors || 0}`);

    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(err => {
        console.log(`   - ${err.name} (${err.id}): ${err.error}`);
      });
    }

    console.log('\n🎉 Products should now be visible on Vercel!');
    console.log(`   Check: ${VERCEL_URL}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    if (error.message.includes('fetch')) {
      console.error('\n💡 Make sure:');
      console.error('   1. Your Vercel app is deployed');
      console.error('   2. MONGODB_URI is set in Vercel environment variables');
      console.error('   3. The URL is correct (currently:', VERCEL_URL, ')');
    }
    process.exit(1);
  }
}

// Run migration
migrateProductsToVercel();

