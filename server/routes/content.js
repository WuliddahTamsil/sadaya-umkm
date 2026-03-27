import express from 'express';
import {
  getAllContentsController,
  getPublishedContentsController,
  getContentByIdController,
  createContentController,
  updateContentController,
  deleteContentController,
  likeContentController
} from '../controllers/contentController.js';

const router = express.Router();

// GET /api/content - Get all contents (admin only - includes drafts)
router.get('/', getAllContentsController);

// GET /api/content/published - Get published contents only (for all users)
router.get('/published', getPublishedContentsController);

// POST /api/content/:id/like - Like content (must be before /:id route)
router.post('/:id/like', likeContentController);

// GET /api/content/:id - Get content by ID
router.get('/:id', getContentByIdController);

// POST /api/content - Create new content (admin only)
router.post('/', createContentController);

// PATCH /api/content/:id - Update content (admin only)
router.patch('/:id', updateContentController);

// DELETE /api/content/:id - Delete content (admin only)
router.delete('/:id', deleteContentController);

export default router;

