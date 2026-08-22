// App name and branding
export const APP_NAME = "ShopSphere";
export const APP_TAGLINE = "Premium E-commerce Platform";

// Routes
export const ROUTES = {
  // User routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  OTP_VERIFICATION: "/otp-verification",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: "/products/:id",
  CATEGORIES: "/categories",
  SEARCH: "/search",
  WISHLIST: "/wishlist",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation/:orderId",
  MY_ORDERS: "/my-orders",
  ORDER_DETAILS: "/my-orders/:orderId",
  USER_PROFILE: "/profile",
  EDIT_PROFILE: "/profile/edit",
  ADDRESS_MANAGEMENT: "/addresses",
  NOTIFICATIONS: "/notifications",

  // Admin routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_PAYMENTS: "/admin/payments",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings"
};

// Product categories
export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Sports",
  "Wearables",
  "Books"
];

// Icon shown next to a product/category based on its category name.
export const CATEGORY_ICONS = {
  Electronics: "📱",
  Fashion: "👗",
  Home: "🏠",
  Sports: "⚽",
  Wearables: "⌚",
  Books: "📚"
};

export const getCategoryIcon = (category) => CATEGORY_ICONS[category] || "🏷️";

// Sort options
export const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" }
];

// Price ranges for filters
export const PRICE_RANGES = [
  { min: 0, max: 50, label: "$0 - $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 250, label: "$100 - $250" },
  { min: 250, max: 500, label: "$250 - $500" },
  { min: 500, max: 1000, label: "$500 - $1000" },
  { min: 1000, max: Infinity, label: "$1000+" }
];

// Rating filters
export const RATING_FILTERS = [
  { value: 4.5, label: "4.5★ & up" },
  { value: 4, label: "4★ & up" },
  { value: 3, label: "3★ & up" },
  { value: 2, label: "2★ & up" }
];

// Order statuses
export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "#FFC107" },
  { value: "confirmed", label: "Confirmed", color: "#2196F3" },
  { value: "processing", label: "Processing", color: "#FF9800" },
  { value: "shipped", label: "Shipped", color: "#9C27B0" },
  { value: "delivered", label: "Delivered", color: "#4CAF50" },
  { value: "cancelled", label: "Cancelled", color: "#F44336" }
];

// Payment statuses
export const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" }
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "wallet", label: "Wallet" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" }
];

// Notification types
export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMED: "order_confirmed",
  ORDER_SHIPPED: "order_shipped",
  ORDER_DELIVERED: "order_delivered",
  PROMOTION: "promotion",
  WISHLIST: "wishlist",
  ACCOUNT: "account"
};

// Tax rate
export const TAX_RATE = 0.10; // 10%

// Shipping rates
export const SHIPPING_RATES = {
  STANDARD: 5,
  EXPRESS: 10,
  OVERNIGHT: 20,
  FREE: 0
};

// Orders at or above this subtotal ship free
export const FREE_SHIPPING_THRESHOLD = 700;

export const getShippingCost = (subtotal) =>
  subtotal >= FREE_SHIPPING_THRESHOLD ? SHIPPING_RATES.FREE : SHIPPING_RATES.EXPRESS;

// Items per page for pagination
export const ITEMS_PER_PAGE = 12;

// User roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SELLER: "seller"
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE: 1440
};
