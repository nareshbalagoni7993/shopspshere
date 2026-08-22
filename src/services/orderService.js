import { mockOrders, getOrderById, getUserOrders, getAllOrders } from "../mock/mockOrders";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const ORDER_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

export const orderService = {
  // Get all orders (for admin)
  getAllOrders: async (filters = {}) => {
    await delay();
    let orders = [...mockOrders];

    if (filters.status) {
      orders = orders.filter(o => o.status === filters.status);
    }

    if (filters.paymentStatus) {
      orders = orders.filter(o => o.paymentStatus === filters.paymentStatus);
    }

    return orders;
  },

  // Get user orders
  getUserOrders: async (userId) => {
    await delay();
    return getUserOrders(userId);
  },

  // Get single order
  getOrder: async (orderId) => {
    await delay();
    return getOrderById(orderId);
  },

  // Create order
  createOrder: async (orderData) => {
    await delay();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);
    const newOrder = {
      id: "ORD-" + String(mockOrders.length + 1).padStart(3, '0'),
      userId: orderData.userId,
      orderDate: new Date().toISOString().split('T')[0],
      status: "processing",
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === "cash_on_delivery" ? "pending" : "completed",
      shippingAddress: orderData.shippingAddress,
      trackingNumber: "SS" + Date.now().toString().slice(-8),
      estimatedDeliveryDate: estimatedDeliveryDate.toISOString().split('T')[0],
      deliveredDate: null
    };

    mockOrders.push(newOrder);

    return {
      success: true,
      order: newOrder
    };
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    await delay();
    const order = getOrderById(orderId);
    if (order) {
      order.status = status;
      if (status === "delivered") {
        order.deliveredDate = new Date().toISOString().split('T')[0];
      }
      return {
        success: true,
        order
      };
    }
    return {
      success: false,
      message: "Order not found"
    };
  },

  // Demo delivery simulator: call every five minutes from the user dashboard.
  progressUserOrders: async (userId) => {
    const progressedOrders = getUserOrders(userId).map((order) => {
      if (order.status === 'cancelled' || order.status === 'delivered') return order;
      const currentIndex = ORDER_FLOW.indexOf(order.status);
      order.status = ORDER_FLOW[Math.min(currentIndex + 1, ORDER_FLOW.length - 1)];
      if (order.status === 'delivered') order.deliveredDate = new Date().toISOString().split('T')[0];
      return order;
    });
    return progressedOrders;
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    await delay();
    const order = getOrderById(orderId);
    if (order) {
      order.paymentStatus = paymentStatus;
      return {
        success: true,
        order
      };
    }
    return {
      success: false,
      message: "Order not found"
    };
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    await delay();
    const order = getOrderById(orderId);
    if (order) {
      order.status = "cancelled";
      order.paymentStatus = "refunded";
      return {
        success: true,
        order
      };
    }
    return {
      success: false,
      message: "Order not found"
    };
  },

  // Get order statistics
  getOrderStats: async () => {
    await delay();
    const orders = mockOrders;
    return {
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === "delivered").length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
      cancelledOrders: orders.filter(o => o.status === "cancelled").length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === "completed")
        .reduce((sum, o) => sum + o.total, 0)
    };
  }
};
