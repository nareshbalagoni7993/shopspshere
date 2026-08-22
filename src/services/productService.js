import { apiRequest } from "./api";

const toQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  return query ? `?${query}` : "";
};

export const productService = {
  getAllProducts: () => apiRequest("/products"),

  getProductsByCategory: (category) => apiRequest(`/products${toQueryString({ category })}`),

  getProduct: (id) => apiRequest(`/products/${id}`),

  searchProducts: (query) => apiRequest(`/products/search${toQueryString({ q: query })}`),

  filterProducts: (filters = {}) =>
    apiRequest(
      `/products${toQueryString({
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        brand: filters.brand
      })}`
    ),

  // Sorts an already-fetched list client-side (mirrors the previous mock behaviour).
  sortProducts: async (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "popular":
        return sorted.sort((a, b) => b.reviews - a.reviews);
      default:
        return sorted;
    }
  },

  getRelatedProducts: (productId) => apiRequest(`/products/${productId}/related`),

  // Admin
  createProduct: async (productData) => {
    try {
      return await apiRequest("/products", { method: "POST", body: productData });
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      return await apiRequest(`/products/${id}`, { method: "PUT", body: productData });
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  deleteProduct: async (id) => {
    try {
      return await apiRequest(`/products/${id}`, { method: "DELETE" });
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};
