// Vercel Serverless Function wrapper for Express API
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from '../server/routes/auth.js';
import usersRoutes from '../server/routes/users.js';
import uploadRoutes from '../server/routes/upload.js';
import ordersRoutes from '../server/routes/orders.js';
import notificationsRoutes from '../server/routes/notifications.js';
import productsRoutes from '../server/routes/products.js';
import cartRoutes from '../server/routes/cart.js';
import walletRoutes from '../server/routes/wallet.js';
import contentRoutes from '../server/routes/content.js';
import setupRoutes from '../server/routes/setup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    if (origin.includes('vercel.app') || origin.includes('netlify.app') || origin.includes('parcel.app')) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - In Vercel, requests to /api/* are routed here
// The path received will be /api/auth/login, so we mount at /api
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/setup', setupRoutes);

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '../server', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend API is running' });
});

// Error handling middleware - HARUS di akhir, setelah semua routes
app.use((err, req, res, next) => {
  console.error('Error middleware caught:', err);
  console.error('Error stack:', err.stack);
  
  // Pastikan selalu return JSON
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || 'Terjadi kesalahan pada server',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Catch-all for unmatched routes (for debugging)
app.use((req, res) => {
  console.log('Unmatched route:', req.method, req.path);
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

// Vercel serverless function handler
export default app;

