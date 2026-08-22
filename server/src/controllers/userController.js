import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { status, role, search } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (role) filter.role = role;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { email: regex }, { mobile: regex }];
  }

  const users = await User.find(filter).sort({ createdDate: -1 });
  res.json(users);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json(user);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create({
    ...req.body,
    avatar: req.body.avatar || `https://i.pravatar.cc/150?u=${req.body.email}`
  });
  res.status(201).json({ success: true, user: user.toJSON() });
});

export const updateUser = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.password; // use a dedicated reset-password flow instead

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, message: 'User deleted successfully' });
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  user.status = user.status === 'active' ? 'inactive' : 'active';
  await user.save();
  res.json({ success: true, user });
});

export const getUserStats = asyncHandler(async (_req, res) => {
  const [totalUsers, activeUsers, admins] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'admin' })
  ]);

  res.json({
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    admins,
    regularUsers: totalUsers - admins
  });
});
