import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import roleReducer from '../features/role/roleSlice';
import userReducer from '../features/user/userSlice';
import calendarReducer from '../features/calendar/calendarSlice';
import expenseReducer from '../features/expense/expenseSlice'; // <-- **เพิ่มบรรทัดนี้**

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: roleReducer,
    users: userReducer,
    calendar: calendarReducer,
    expenses: expenseReducer, // <-- **เพิ่มบรรทัดนี้**
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});