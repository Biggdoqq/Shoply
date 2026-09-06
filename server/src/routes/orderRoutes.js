import express from 'express';
import {
  createOrder,
  getAllOrders,
  trackOrder,
  getOrderByIdOrNumber,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/track', trackOrder);
router.get('/', requireAdmin, getAllOrders);
router.get('/:id', getOrderByIdOrNumber);
router.put('/:id/status', requireAdmin, updateOrderStatus);
router.delete('/:id', requireAdmin, deleteOrder);

export default router;
