import { Router } from 'express';
import {
  getOrders,
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  progressUserOrders,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', adminOnly, getOrders);
router.get('/stats/summary', adminOnly, getOrderStats);
router.get('/user/:userId', getUserOrders);
router.post('/user/:userId/progress', progressUserOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.patch('/:id/payment-status', adminOnly, updatePaymentStatus);
router.patch('/:id/cancel', cancelOrder);

export default router;
