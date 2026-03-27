import express from 'express';
import {
  getCommentsController,
  createCommentController,
  deleteCommentController
} from '../controllers/commentController.js';

const router = express.Router();

// GET /api/comments/:contentId - Get comments by content ID
router.get('/:contentId', getCommentsController);

// POST /api/comments - Create new comment
router.post('/', createCommentController);

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', deleteCommentController);

export default router;

