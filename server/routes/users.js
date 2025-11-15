import express from 'express';
import { getAllUsers, getUserById, updateUserStatus } from '../controllers/usersController.js';

const router = express.Router();

// GET /api/users - Get all users (untuk admin)
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// PATCH /api/users/:id/status - Update user status (untuk admin)
router.patch('/:id/status', updateUserStatus);

export default router;

