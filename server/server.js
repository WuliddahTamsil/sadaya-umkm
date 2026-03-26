import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import ordersRoutes from './routes/orders.js';
import notificationsRoutes from './routes/notifications.js';
import productsRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import walletRoutes from './routes/wallet.js';
import contentRoutes from './routes/content.js';
import commentRoutes from './routes/comments.js';
import setupRoutes from './routes/setup.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';
import workshopRoutes from './routes/workshops.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - allow requests from Vercel and localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow Vercel domains
    if (origin.includes('vercel.app') || origin.includes('netlify.app')) {
      return callback(null, true);
    }
    
    // Allow all origins in development, restrict in production if needed
    callback(null, true);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/chat', chatRoutes);

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

