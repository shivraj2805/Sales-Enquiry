import express from 'express';
import {
  getDashboardStats,
  getTeamPerformance,
  getMarketAnalysis,
  getTrendAnalysis,
  getActivityDistribution,
  getProductDistribution,
  getFulfillmentAnalysis,
} from '../controllers/dashboardController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/team-performance', protect, getTeamPerformance);
router.get('/market-analysis', protect, getMarketAnalysis);
router.get('/trend-analysis', protect, getTrendAnalysis);
router.get('/activity-distribution', protect, getActivityDistribution);
router.get('/product-distribution', protect, getProductDistribution);
router.get('/fulfillment-analysis', protect, getFulfillmentAnalysis);

export default router;
