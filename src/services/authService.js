import { apiRequest } from "./api";

const asResult = async (promise) => {
  try {
    return await promise;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const authService = {
  login: (email, password) =>
    asResult(apiRequest("/auth/login", { method: "POST", body: { email, password } })),

  register: (userData) =>
    asResult(apiRequest("/auth/register", { method: "POST", body: userData })),

  sendOTP: (email) => asResult(apiRequest("/auth/send-otp", { method: "POST", body: { email } })),

  verifyOTP: (email, otp) =>
    asResult(apiRequest("/auth/verify-otp", { method: "POST", body: { email, otp } })),

  forgotPassword: (email) =>
    asResult(apiRequest("/auth/forgot-password", { method: "POST", body: { email } })),

  resetPassword: (email, newPassword) =>
    asResult(apiRequest("/auth/reset-password", { method: "POST", body: { email, newPassword } })),

  logout: () => asResult(apiRequest("/auth/logout", { method: "POST" })),

  getCurrentUser: () => apiRequest("/auth/me"),

  updateProfile: (_userId, profileData) =>
    asResult(apiRequest("/auth/profile", { method: "PUT", body: profileData }))
};
