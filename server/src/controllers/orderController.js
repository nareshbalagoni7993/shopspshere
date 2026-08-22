import Order, { ORDER_STATUSES } from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const DELIVERY_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const nextOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `ORD-${String(count + 1).padStart(6, '0')}`;
};

export const getOrders = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const orders = await Order.find(filter).populate('user', 'name email').sort({ orderDate: -1 });
  res.json(orders);
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).sort({ orderDate: -1 });
  res.json(orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json(order);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { userId, items, subtotal, tax, shipping, total, paymentMethod, shippingAddress } = req.body;

  if (!items?.length || !shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error('items, shippingAddress and paymentMethod are required');
  }

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

  const order = await Order.create({
    orderNumber: await nextOrderNumber(),
    user: userId || req.user?._id,
    items,
    subtotal,
    tax,
    shipping,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
    shippingAddress,
    trackingNumber: `SS${Date.now().toString().slice(-8)}`,
    estimatedDeliveryDate
  });

  res.status(201).json({ success: true, order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const order = await Order.findOne({ orderNumber: req.params.id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;
  if (status === 'delivered') order.deliveredDate = new Date();
  await order.save();

  res.json({ success: true, order });
});

// Demo delivery simulator: advances every non-terminal order for a user by one step.
export const progressUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.params.userId,
    status: { $nin: ['cancelled', 'delivered'] }
  });

  await Promise.all(
    orders.map((order) => {
      const currentIndex = DELIVERY_FLOW.indexOf(order.status);
      order.status = DELIVERY_FLOW[Math.min(currentIndex + 1, DELIVERY_FLOW.length - 1)];
      if (order.status === 'delivered') order.deliveredDate = new Date();
      return order.save();
    })
  );

  const allOrders = await Order.find({ user: req.params.userId }).sort({ orderDate: -1 });
  res.json(allOrders);
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;
  const order = await Order.findOne({ orderNumber: req.params.id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.paymentStatus = paymentStatus;
  await order.save();
  res.json({ success: true, order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.status = 'cancelled';
  order.paymentStatus = 'refunded';
  await order.save();
  res.json({ success: true, order });
});

export const getOrderStats = asyncHandler(async (_req, res) => {
  const orders = await Order.find();
  res.json({
    totalOrders: orders.length,
    completedOrders: orders.filter((o) => o.status === 'delivered').length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === 'completed')
      .reduce((sum, o) => sum + o.total, 0)
  });
});
