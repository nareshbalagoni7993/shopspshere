// Currency formatting
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Date formatting
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Time formatting
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  return formatDate(date);
};

// Truncate text
export const truncateText = (text, length = 50) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, discountedPrice) => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// Validate email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate phone
export const validatePhone = (phone) => {
  const regex = /^[\d\s\-\+\(\)]{10,}$/;
  return regex.test(phone);
};

// Generate rating color
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return '#4CAF50'; // Green
  if (rating >= 4) return '#8BC34A'; // Light Green
  if (rating >= 3) return '#FFC107'; // Amber
  return '#FF9800'; // Orange
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    delivered: '#4CAF50',
    shipped: '#2196F3',
    processing: '#FF9800',
    pending: '#FFC107',
    cancelled: '#F44336',
    active: '#4CAF50',
    inactive: '#999999'
  };
  return colors[status] || '#999999';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Capitalize first letter
export const capitalizeFirst = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
