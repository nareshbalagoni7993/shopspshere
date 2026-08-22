import { apiUpload, resolveAssetUrl } from "./api";

export const uploadService = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await apiUpload("/uploads/image", formData);
      return { success: true, url: resolveAssetUrl(result.url) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};
