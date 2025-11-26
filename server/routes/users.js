import express from 'express';
import { getAllUsers, getUserById, updateUserStatus, updateUserProfile, deleteUser } from '../controllers/usersController.js';

const router = express.Router();

// GET /api/users - Get all users (untuk admin)
router.get('/', getAllUsers);

// PATCH /api/users/:id/status - Update user status (untuk admin)
router.patch('/:id/status', updateUserStatus);

// PATCH /api/users/:id - Update user profile (untuk semua role)
router.patch('/:id', updateUserProfile);

// DELETE /api/users/:id - Delete user (untuk admin)
router.delete('/:id', deleteUser);

// GET /api/users/:id - Get user by ID (harus di akhir karena catch-all)
router.get('/:id', getUserById);

export default router;

