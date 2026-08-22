import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  unreadCount: 0
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },

    markAsRead: (state, action) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },

    markAllAsRead: (state) => {
      state.items.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },

    removeNotification: (state, action) => {
      const index = state.items.findIndex(n => n.id === action.payload);
      if (index > -1) {
        if (!state.items[index].read) {
          state.unreadCount -= 1;
        }
        state.items.splice(index, 1);
      }
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },

    loadNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = state.items.filter(n => !n.read).length;
    }
  }
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  loadNotifications
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
