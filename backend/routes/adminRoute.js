import express from 'express';
import { getAdminStats, getAnalytics } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

// Admin dashboard statistics
adminRouter.get('/stats', adminAuth, getAdminStats);

// Admin analytics for charts
adminRouter.get('/analytics', adminAuth, getAnalytics);

export default adminRouter; 