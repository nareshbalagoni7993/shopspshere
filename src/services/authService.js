import { mockUsers, getCurrentUser, getUserByEmail } from "../mock/mockUsers";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Login
  login: async (email, password) => {
    await delay();
    const user = getUserByEmail(email);
    
    if (user && password === "password123") {
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token: "mock_jwt_token_" + user.id
      };
    }
    
    return {
      success: false,
      message: "Invalid email or password"
    };
  },

  // Register
  register: async (userData) => {
    await delay();
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: "user",
      status: "active",
      createdDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
      addresses: []
    };
    
    mockUsers.push(newUser);
    
    return {
      success: true,
      user: newUser,
      token: "mock_jwt_token_" + newUser.id
    };
  },

  // Send OTP
  sendOTP: async (email) => {
    await delay();
    return {
      success: true,
      message: "OTP sent to " + email,
      otp: "123456" // Mock OTP
    };
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    await delay();
    if (otp === "123456") {
      return {
        success: true,
        message: "OTP verified successfully"
      };
    }
    return {
      success: false,
      message: "Invalid OTP"
    };
  },

  // Forgot password
  forgotPassword: async (email) => {
    await delay();
    const user = getUserByEmail(email);
    if (user) {
      return {
        success: true,
        message: "Reset link sent to " + email
      };
    }
    return {
      success: false,
      message: "User not found"
    };
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    await delay();
    return {
      success: true,
      message: "Password reset successfully"
    };
  },

  // Logout
  logout: async () => {
    await delay();
    return {
      success: true
    };
  },

  // Get current user
  getCurrentUser: async () => {
    await delay();
    return getCurrentUser();
  },

  // Update profile
  updateProfile: async (userId, profileData) => {
    await delay();
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      Object.assign(user, profileData);
      return {
        success: true,
        user
      };
    }
    return {
      success: false,
      message: "User not found"
    };
  }
};
