import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderByIdOrNumber,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderByIdOrNumber);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
