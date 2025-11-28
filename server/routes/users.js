import express from 'express';
import { getAllUsers, getUserById, updateUserStatus, updateUserProfile, deleteUser, createUser } from '../controllers/usersController.js';

const router = express.Router();

// Add logging middleware untuk debugging
router.use((req, res, next) => {
  console.log(`[Users Router] ${req.method} ${req.path} | Params:`, req.params, 'Original:', req.originalUrl, 'URL:', req.url);
  // Fix path jika ada masalah dengan routing
  if (req.path && !req.path.startsWith('/')) {
    req.path = '/' + req.path;
  }
  next();
});

// GET /api/users - Get all users (untuk admin)
router.get('/', getAllUsers);

// POST /api/users - Create user (untuk admin)
router.post('/', createUser);

// PATCH /api/users/:id/status - Update user status (untuk admin)
// HARUS sebelum route /:id agar tidak tertangkap oleh route yang lebih umum
router.patch('/:id/status', (req, res, next) => {
  // Verify that this is actually a status update request
  if (!req.path.endsWith('/status') && !req.originalUrl.endsWith('/status') && !req.url.endsWith('/status')) {
    return next('route'); // Skip to next route
  }
  console.log('Status update route matched - ID:', req.params.id, 'Path:', req.path, 'Original:', req.originalUrl);
  updateUserStatus(req, res, next);
});

// PATCH /api/users/:id - Update user profile (untuk semua role)
// Skip jika path berakhir dengan /status
router.patch('/:id', (req, res, next) => {
  // Skip jika ini seharusnya match dengan /:id/status
  if (req.path.endsWith('/status') || req.originalUrl.endsWith('/status') || req.url.endsWith('/status')) {
    return next('route'); // Skip to next route
  }
  console.log('Profile update route matched - ID:', req.params.id, 'Path:', req.path);
  updateUserProfile(req, res, next);
});

// DELETE /api/users/:id - Delete user (untuk admin)
router.delete('/:id', deleteUser);

// GET /api/users/:id - Get user by ID (harus di akhir karena catch-all)
router.get('/:id', getUserById);

export default router;

