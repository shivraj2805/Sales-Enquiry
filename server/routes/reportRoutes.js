import express from 'express';
import { generateReport, exportData } from '../controllers/reportController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/generate', protect, authorize('admin', 'management'), generateReport);
router.post('/export', protect, exportData);

export default router;
