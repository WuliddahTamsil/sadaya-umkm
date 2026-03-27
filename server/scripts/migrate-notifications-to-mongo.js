/**
 * Script to migrate notifications from JSON file to MongoDB
 *
 * Usage:
 *   node server/scripts/migrate-notifications-to-mongo.js
 *
 * Make sure MONGODB_URI is set in your environment
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllNotifications as getMongoNotifications, saveNotification as saveMongoNotification } from '../models/notificationModelMongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrateNotifications() {
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

    // Read notifications from JSON file
    const notificationsJsonPath = join(__dirname, '../../server/data/notifications.json');
    console.log(`📖 Reading notifications from: ${notificationsJsonPath}`);

    const jsonData = await readFile(notificationsJsonPath, 'utf-8');
    const notificationsFromJson = JSON.parse(jsonData);
    console.log(`📦 Found ${notificationsFromJson.length} notifications in JSON file`);

    // Get existing notifications from MongoDB
    console.log('🔍 Checking existing notifications in MongoDB...');
    const existingNotifications = await getMongoNotifications();
    const existingIds = new Set(existingNotifications.map(n => n.id));
    console.log(`📊 Found ${existingNotifications.length} existing notifications in MongoDB`);

    // Migrate notifications
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🚀 Starting migration...');
    for (const notification of notificationsFromJson) {
      try {
        if (existingIds.has(notification.id)) {
          console.log(`⏭️  Skipped: ${notification.id} - already exists`);
          skipped++;
          continue;
        }

        await saveMongoNotification(notification);
        console.log(`✅ Migrated: ${notification.title}`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating notification ${notification.id}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Total notifications: ${notificationsFromJson.length}`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);

    if (migrated > 0 || skipped > 0) {
      console.log('✅ Migration completed!');
    } else {
      console.log('ℹ️  No notifications to migrate');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateNotifications();