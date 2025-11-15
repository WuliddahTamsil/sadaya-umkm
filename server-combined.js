import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './server/routes/auth.js';
import usersRoutes from './server/routes/users.js';
import uploadRoutes from './server/routes/upload.js';
import ordersRoutes from './server/routes/orders.js';
import notificationsRoutes from './server/routes/notifications.js';
import productsRoutes from './server/routes/products.js';
import cartRoutes from './server/routes/cart.js';
import walletRoutes from './server/routes/wallet.js';
import contentRoutes from './server/routes/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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

// API Routes
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
app.use('/uploads', express.static(join(__dirname, 'server', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend API is running' });
});

// Serve static files from dist folder (built frontend)
app.use(express.static(join(__dirname, 'dist')));

// For SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ error: 'Not found' });
  }
  // Serve index.html for SPA routing
  const indexPath = join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).json({ 
        error: 'Frontend not built yet. Please run "npm run build" first.' 
      });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend served from http://localhost:${PORT}`);
});

export default app;

