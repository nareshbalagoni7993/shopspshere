import { apiRequest } from "./api";

const asResult = async (promise) => {
  try {
    return await promise;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const categoryService = {
  getAllCategories: () => apiRequest("/categories"),
  getCategory: (id) => apiRequest(`/categories/${id}`),
  createCategory: (data) => asResult(apiRequest("/categories", { method: "POST", body: data })),
  updateCategory: (id, data) =>
    asResult(apiRequest(`/categories/${id}`, { method: "PUT", body: data })),
  deleteCategory: (id) => asResult(apiRequest(`/categories/${id}`, { method: "DELETE" }))
};
