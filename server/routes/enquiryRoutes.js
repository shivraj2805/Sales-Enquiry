import express from 'express';
import { body } from 'express-validator';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  uploadAttachment,
} from '../controllers/enquiryController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getEnquiries)
  .post(
    protect,
    authorize('admin', 'sales', 'r&d'),
    [
      body('customerName').notEmpty().withMessage('Customer name is required'),
      body('marketType').notEmpty().withMessage('Market type is required'),
      body('productType').notEmpty().withMessage('Product type is required'),
    ],
    validate,
    createEnquiry
  );

router
  .route('/:id')
  .get(protect, getEnquiryById)
  .put(protect, authorize('admin', 'sales', 'r&d'), updateEnquiry)
  .delete(protect, authorize('admin'), deleteEnquiry);

router.post('/:id/attachments', protect, uploadAttachment);

export default router;
