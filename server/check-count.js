import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

try {
  await mongoose.connect(uri.trim(), { serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000 });
  const db = mongoose.connection.db;
  const colls = ['users', 'products', 'orders', 'notifications', 'carts', 'comments'];
  for (const c of colls) {
    const count = await db.collection(c).countDocuments();
    console.log(`${c}: ${count}`);
  }
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}
