/**
 * Script to migrate comments from JSON file to MongoDB
 *
 * Usage:
 *   node server/scripts/migrate-comments-to-mongo.js
 *
 * Make sure MONGODB_URI is set in your environment
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define Comment model locally for migration
const commentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  contentId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userRole: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

async function migrateComments() {
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

    // Read comments from JSON file
    const commentsJsonPath = join(__dirname, '../../server/data/comments.json');
    console.log(`📖 Reading comments from: ${commentsJsonPath}`);

    const jsonData = await readFile(commentsJsonPath, 'utf-8');
    const commentsFromJson = JSON.parse(jsonData);
    console.log(`📦 Found ${commentsFromJson.length} comments in JSON file`);

    // Get existing comments from MongoDB
    console.log('🔍 Checking existing comments in MongoDB...');
    const existingComments = await Comment.find({}).lean();
    const existingIds = new Set(existingComments.map(c => c.id));
    console.log(`📊 Found ${existingComments.length} existing comments in MongoDB`);

    // Migrate comments
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🚀 Starting migration...');
    for (const comment of commentsFromJson) {
      try {
        if (existingIds.has(comment.id)) {
          console.log(`⏭️  Skipped: ${comment.id} - already exists`);
          skipped++;
          continue;
        }

        const item = new Comment(comment);
        await item.save();
        console.log(`✅ Migrated: ${comment.text.substring(0, 20)}...`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating comment ${comment.id}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Total comments: ${commentsFromJson.length}`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);

    if (migrated > 0 || skipped > 0) {
      console.log('✅ Migration completed!');
    } else {
      console.log('ℹ️  No comments to migrate');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateComments();