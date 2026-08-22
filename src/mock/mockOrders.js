export const mockOrders = [
  {
    id: "ORD-001",
    userId: 1,
    orderDate: "2024-08-15",
    status: "delivered",
    items: [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        quantity: 1,
        price: 299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
      },
      {
        id: 3,
        name: "Premium Backpack",
        quantity: 2,
        price: 79.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 459.97,
    tax: 45.00,
    shipping: 10.00,
    total: 514.97,
    paymentMethod: "credit_card",
    paymentStatus: "completed",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    trackingNumber: "TRACK123456",
    deliveredDate: "2024-08-20"
  },
  {
    id: "ORD-002",
    userId: 1,
    orderDate: "2024-08-18",
    status: "processing",
    items: [
      {
        id: 4,
        name: "Running Shoes Ultra",
        quantity: 1,
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 129.99,
    tax: 12.00,
    shipping: 0.00,
    total: 141.99,
    paymentMethod: "debit_card",
    paymentStatus: "completed",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    trackingNumber: "TRACK789012",
    deliveredDate: null
  },
  {
    id: "ORD-003",
    userId: 1,
    orderDate: "2024-08-20",
    status: "pending",
    items: [
      {
        id: 2,
        name: "Smart Watch Pro",
        quantity: 1,
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 199.99,
    tax: 19.00,
    shipping: 5.00,
    total: 223.99,
    paymentMethod: "wallet",
    paymentStatus: "pending",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    trackingNumber: null,
    deliveredDate: null
  },
  {
    id: "ORD-004",
    userId: 1,
    orderDate: "2024-08-10",
    status: "cancelled",
    items: [
      {
        id: 5,
        name: "USB-C Charging Hub",
        quantity: 2,
        price: 49.99,
        image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 99.98,
    tax: 10.00,
    shipping: 5.00,
    total: 114.98,
    paymentMethod: "credit_card",
    paymentStatus: "refunded",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    trackingNumber: null,
    deliveredDate: null
  },
  {
    id: "ORD-005",
    userId: 1,
    orderDate: "2024-08-05",
    status: "shipped",
    items: [
      {
        id: 7,
        name: "Premium T-Shirt",
        quantity: 3,
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 89.97,
    tax: 8.50,
    shipping: 5.00,
    total: 103.47,
    paymentMethod: "credit_card",
    paymentStatus: "completed",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    trackingNumber: "TRACK345678",
    deliveredDate: null
  }
];

export const getOrderById = (id) => {
  return mockOrders.find(o => o.id === id);
};

export const getUserOrders = (userId) => {
  return mockOrders.filter(o => o.userId === userId);
};

export const getAllOrders = () => {
  return mockOrders;
};
