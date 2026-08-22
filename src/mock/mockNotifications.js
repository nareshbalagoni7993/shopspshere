export const mockNotifications = [
  {
    id: 1,
    userId: 1,
    type: "order_confirmed",
    title: "Order Confirmed",
    message: "Your order #ORD-001 has been confirmed",
    icon: "✓",
    timestamp: "2024-08-15T10:30:00",
    read: false,
    actionUrl: "/orders/ORD-001"
  },
  {
    id: 2,
    userId: 1,
    type: "order_shipped",
    title: "Order Shipped",
    message: "Your order #ORD-001 has been shipped with tracking number TRACK123456",
    icon: "📦",
    timestamp: "2024-08-16T14:20:00",
    read: false,
    actionUrl: "/orders/ORD-001"
  },
  {
    id: 3,
    userId: 1,
    type: "order_delivered",
    title: "Order Delivered",
    message: "Your order #ORD-001 has been delivered successfully",
    icon: "🎉",
    timestamp: "2024-08-20T09:15:00",
    read: true,
    actionUrl: "/orders/ORD-001"
  },
  {
    id: 4,
    userId: 1,
    type: "promotion",
    title: "Special Offer",
    message: "Get 40% off on all electronics this weekend",
    icon: "🎁",
    timestamp: "2024-08-21T08:00:00",
    read: true,
    actionUrl: "/products?category=electronics"
  },
  {
    id: 5,
    userId: 1,
    type: "wishlist",
    title: "Price Drop",
    message: "Premium Wireless Headphones price has dropped to $299.99",
    icon: "💰",
    timestamp: "2024-08-21T11:45:00",
    read: false,
    actionUrl: "/products/1"
  },
  {
    id: 6,
    userId: 1,
    type: "account",
    title: "Profile Updated",
    message: "Your profile has been successfully updated",
    icon: "👤",
    timestamp: "2024-08-19T15:30:00",
    read: true,
    actionUrl: "/profile"
  }
];

export const getUserNotifications = (userId) => {
  return mockNotifications.filter(n => n.userId === userId);
};

export const getUnreadNotifications = (userId) => {
  return mockNotifications.filter(n => n.userId === userId && !n.read);
};
