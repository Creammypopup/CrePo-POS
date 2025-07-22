import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import roleReducer from '../features/role/roleSlice';
import userReducer from '../features/user/userSlice';
import calendarReducer from '../features/calendar/calendarSlice'; // << เพิ่มบรรทัดนี้

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: roleReducer,
    users: userReducer,
    calendar: calendarReducer, // << เพิ่มบรรทัดนี้
  },
  // Add middleware to prevent non-serializable value error with Dates
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});