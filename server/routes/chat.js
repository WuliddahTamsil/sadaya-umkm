import express from 'express';
import { chatController } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Send message to AI chat
router.post('/', (req, res, next) => {
  console.log('Chat route hit!');
  chatController(req, res).catch(next);
});

export default router;

