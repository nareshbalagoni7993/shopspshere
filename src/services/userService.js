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

export const userService = {
  getAllUsers: (filters = {}) =>
    apiRequest(`/users${toQueryString({ status: filters.status, role: filters.role, search: filters.search })}`),

  getUser: (userId) => apiRequest(`/users/${userId}`),

  createUser: (userData) => asResult(apiRequest("/users", { method: "POST", body: userData })),

  updateUser: (userId, userData) =>
    asResult(apiRequest(`/users/${userId}`, { method: "PUT", body: userData })),

  deleteUser: (userId) => asResult(apiRequest(`/users/${userId}`, { method: "DELETE" })),

  toggleUserStatus: (userId) =>
    asResult(apiRequest(`/users/${userId}/toggle-status`, { method: "PATCH" })),

  getUserStats: () => apiRequest("/users/stats/summary")
};
