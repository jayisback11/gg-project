import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: null,
  },
  reducers: {
    reduxSetNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
});

export const { reduxSetNotification } = notificationSlice.actions;
export const selectNotification = (state) => state.notification.notification;
export default notificationSlice.reducer;
