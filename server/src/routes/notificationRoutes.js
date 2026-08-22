import { Router } from 'express';
import {
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/user/:userId', getUserNotifications);
router.get('/user/:userId/unread', getUnreadNotifications);
router.patch('/user/:userId/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
