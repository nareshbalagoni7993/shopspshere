import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);

      if (!exists) {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          rating: product.rating,
          category: product.category
        });
      }
    },

    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);

      if (exists) {
        state.items = state.items.filter(item => item.id !== product.id);
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          rating: product.rating,
          category: product.category
        });
      }
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    loadWishlist: (state, action) => {
      state.items = action.payload;
    },

    isInWishlist: (state, action) => {
      return state.items.some(item => item.id === action.payload);
    }
  }
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, loadWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
