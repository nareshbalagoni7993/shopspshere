import { mockUsers } from "../mock/mockUsers";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  // Get all users (for admin)
  getAllUsers: async (filters = {}) => {
    await delay();
    let users = [...mockUsers];

    if (filters.status) {
      users = users.filter(u => u.status === filters.status);
    }

    if (filters.role) {
      users = users.filter(u => u.role === filters.role);
    }

    if (filters.search) {
      const lowerSearch = filters.search.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(lowerSearch) ||
        u.email.toLowerCase().includes(lowerSearch) ||
        u.mobile.includes(filters.search)
      );
    }

    return users;
  },

  // Get user by id
  getUser: async (userId) => {
    await delay();
    return mockUsers.find(u => u.id === userId);
  },

  // Create user (admin)
  createUser: async (userData) => {
    await delay();
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      createdDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
      addresses: []
    };

    mockUsers.push(newUser);

    return {
      success: true,
      user: newUser
    };
  },

  // Update user
  updateUser: async (userId, userData) => {
    await delay();
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      Object.assign(user, userData);
      return {
        success: true,
        user
      };
    }
    return {
      success: false,
      message: "User not found"
    };
  },

  // Delete user
  deleteUser: async (userId) => {
    await delay();
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index > -1) {
      mockUsers.splice(index, 1);
      return {
        success: true,
        message: "User deleted successfully"
      };
    }
    return {
      success: false,
      message: "User not found"
    };
  },

  // Toggle user status
  toggleUserStatus: async (userId) => {
    await delay();
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.status = user.status === "active" ? "inactive" : "active";
      return {
        success: true,
        user
      };
    }
    return {
      success: false,
      message: "User not found"
    };
  },

  // Get user statistics
  getUserStats: async () => {
    await delay();
    return {
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === "active").length,
      inactiveUsers: mockUsers.filter(u => u.status === "inactive").length,
      admins: mockUsers.filter(u => u.role === "admin").length,
      regularUsers: mockUsers.filter(u => u.role === "user").length
    };
  }
};
