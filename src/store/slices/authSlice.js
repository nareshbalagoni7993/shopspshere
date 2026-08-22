import { createSlice } from "@reduxjs/toolkit";
import { getStoredAuth, setStoredAuth, clearStoredAuth } from "../../services/api";

const stored = getStoredAuth();

const initialState = {
  user: stored?.user || null,
  isAuthenticated: Boolean(stored?.token),
  token: stored?.token || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.loading = false;
      setStoredAuth(action.payload.user, action.payload.token);
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      clearStoredAuth();
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      setStoredAuth(action.payload, state.token);
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, clearError } =
  authSlice.actions;

export default authSlice.reducer;
