import express from 'express';
import { getRecentActivities } from '../controllers/adminController.js';

const router = express.Router();

// GET /api/admin/activities - Get recent activities for admin dashboard
router.get('/activities', getRecentActivities);

export default router;

