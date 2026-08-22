import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.params.userId }).sort({ timestamp: -1 });
  res.json(notifications);
});

export const getUnreadNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.params.userId, read: false }).sort({
    timestamp: -1
  });
  res.json(notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }
  res.json({ success: true, notification });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.params.userId, read: false }, { read: true });
  res.json({ success: true });
});
