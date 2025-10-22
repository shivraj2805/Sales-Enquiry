import express from 'express';
import {
  getDashboardStats,
  getTeamPerformance,
  getMarketAnalysis,
  getTrendAnalysis,
} from '../controllers/dashboardController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/team-performance', protect, getTeamPerformance);
router.get('/market-analysis', protect, getMarketAnalysis);
router.get('/trend-analysis', protect, getTrendAnalysis);

export default router;
