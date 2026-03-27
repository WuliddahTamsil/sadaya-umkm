/**
 * Script to migrate users from JSON file to MongoDB
 *
 * Usage:
 *   node server/scripts/migrate-users-to-mongo.js
 *
 * Make sure MONGODB_URI is set in your environment
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllUsers as getMongoUsers, saveUser as saveMongoUser } from '../models/userModelMongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrateUsers() {
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

    // Read users from JSON file
    const usersJsonPath = join(__dirname, '../../server/data/users.json');
    console.log(`📖 Reading users from: ${usersJsonPath}`);

    const jsonData = await readFile(usersJsonPath, 'utf-8');
    const usersFromJson = JSON.parse(jsonData);
    console.log(`📦 Found ${usersFromJson.length} users in JSON file`);

    // Get existing users from MongoDB
    console.log('🔍 Checking existing users in MongoDB...');
    const existingUsers = await getMongoUsers();
    const existingIds = new Set(existingUsers.map(u => u.id));
    console.log(`📊 Found ${existingUsers.length} existing users in MongoDB`);

    // Migrate users
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🚀 Starting migration...');
    for (const user of usersFromJson) {
      try {
        if (existingIds.has(user.id)) {
          console.log(`⏭️  Skipped: ${user.name} (${user.id}) - already exists`);
          skipped++;
          continue;
        }

        await saveMongoUser(user);
        console.log(`✅ Migrated: ${user.name}`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating user ${user.id}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Total users: ${usersFromJson.length}`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);

    if (migrated > 0 || skipped > 0) {
      console.log('✅ Migration completed!');
    } else {
      console.log('ℹ️  No users to migrate');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateUsers();