import { apiRequest } from "./api";

const asResult = async (promise) => {
  try {
    return await promise;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const toQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  return query ? `?${query}` : "";
};

export const orderService = {
  getAllOrders: (filters = {}) =>
    apiRequest(`/orders${toQueryString({ status: filters.status, paymentStatus: filters.paymentStatus })}`),

  getUserOrders: (userId) => apiRequest(`/orders/user/${userId}`),

  getOrder: (orderId) => apiRequest(`/orders/${orderId}`),

  createOrder: (orderData) =>
    asResult(apiRequest("/orders", { method: "POST", body: orderData })),

  updateOrderStatus: (orderId, status) =>
    asResult(apiRequest(`/orders/${orderId}/status`, { method: "PATCH", body: { status } })),

  // Demo delivery simulator: call every five minutes from the user dashboard.
  // showLoader: false — this runs silently in the background, not from a user action.
  progressUserOrders: (userId) =>
    apiRequest(`/orders/user/${userId}/progress`, { method: "POST", showLoader: false }),

  updatePaymentStatus: (orderId, paymentStatus) =>
    asResult(apiRequest(`/orders/${orderId}/payment-status`, { method: "PATCH", body: { paymentStatus } })),

  cancelOrder: (orderId) => asResult(apiRequest(`/orders/${orderId}/cancel`, { method: "PATCH" })),

  getOrderStats: () => apiRequest("/orders/stats/summary")
};
