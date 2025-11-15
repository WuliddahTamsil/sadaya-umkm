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

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '../server', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend API is running' });
});

// Vercel serverless function handler
export default app;

