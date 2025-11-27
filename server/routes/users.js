import express from 'express';
import { getAllUsers, getUserById, updateUserStatus, updateUserProfile, deleteUser, createUser } from '../controllers/usersController.js';

const router = express.Router();

// Add logging middleware untuk debugging
router.use((req, res, next) => {
  console.log(`[Users Router] ${req.method} ${req.path} | Params:`, req.params);
  next();
});

// GET /api/users - Get all users (untuk admin)
router.get('/', getAllUsers);

// POST /api/users - Create user (untuk admin)
router.post('/', createUser);

// PATCH /api/users/:id/status - Update user status (untuk admin)
// HARUS sebelum route /:id agar tidak tertangkap oleh route yang lebih umum
router.patch('/:id/status', async (req, res, next) => {
  try {
    console.log('Status update route matched - ID:', req.params.id, 'Path:', req.path);
    await updateUserStatus(req, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id - Update user profile (untuk semua role)
router.patch('/:id', updateUserProfile);

// DELETE /api/users/:id - Delete user (untuk admin)
router.delete('/:id', deleteUser);

// GET /api/users/:id - Get user by ID (harus di akhir karena catch-all)
router.get('/:id', getUserById);

export default router;

