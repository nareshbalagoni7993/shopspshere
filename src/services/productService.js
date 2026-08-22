import { mockProducts, getProductsByCategory, getProductById, searchProducts } from "../mock/mockProducts";

// Mock delay to simulate API calls
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  // Get all products
  getAllProducts: async () => {
    await delay();
    return mockProducts;
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    await delay();
    return getProductsByCategory(category);
  },

  // Get single product
  getProduct: async (id) => {
    await delay();
    return getProductById(id);
  },

  // Search products
  searchProducts: async (query) => {
    await delay();
    return searchProducts(query);
  },

  // Filter products
  filterProducts: async (filters) => {
    await delay();
    let filtered = [...mockProducts];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }

    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }

    return filtered;
  },

  // Sort products
  sortProducts: async (products, sortBy) => {
    await delay();
    const sorted = [...products];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      case "popular":
        return sorted.sort((a, b) => b.reviews - a.reviews);
      default:
        return sorted;
    }
  },

  // Get related products
  getRelatedProducts: async (productId, category) => {
    await delay();
    return mockProducts
      .filter(p => p.category === category && p.id !== productId)
      .slice(0, 5);
  }
};
