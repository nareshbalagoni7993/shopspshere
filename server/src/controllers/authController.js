import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Demo-only in-memory OTP store: { email: { code, expiresAt } }.
// A production build would persist this (Redis) and deliver the code via email/SMS
// instead of returning it in the response.
const otpStore = new Map();

export const register = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    mobile,
    password,
    avatar: `https://i.pravatar.cc/150?u=${email}`
  });

  res.status(201).json({
    success: true,
    user: user.toJSON(),
    token: generateToken(user._id)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (user.status === 'inactive') {
    return res.status(403).json({ success: false, message: 'This account has been deactivated' });
  }

  res.json({
    success: true,
    user: user.toJSON(),
    token: generateToken(user._id)
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user.toJSON());
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, mobile, avatar, addresses } = req.body;

  if (name !== undefined) req.user.name = name;
  if (mobile !== undefined) req.user.mobile = mobile;
  if (avatar !== undefined) req.user.avatar = avatar;
  if (addresses !== undefined) req.user.addresses = addresses;

  await req.user.save();
  res.json({ success: true, user: req.user.toJSON() });
});

export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const code = crypto.randomInt(100000, 999999).toString();
  otpStore.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

  res.json({
    success: true,
    message: `OTP sent to ${email}`,
    otp: code // demo only — remove once real delivery (email/SMS) is wired up
  });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const entry = otpStore.get(email);

  if (!entry || entry.expiresAt < Date.now() || entry.code !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  otpStore.delete(email);
  res.json({ success: true, message: 'OTP verified successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Demo-only: a production build would email a signed, expiring reset link
  // instead of returning the token directly.
  const resetToken = crypto.randomBytes(32).toString('hex');
  res.json({ success: true, message: `Reset link sent to ${email}`, resetToken });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password reset successfully' });
});
