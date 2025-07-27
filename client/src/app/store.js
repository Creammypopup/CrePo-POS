import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import roleReducer from "../features/role/roleSlice";
import calendarReducer from "../features/calendar/calendarSlice";
import expenseReducer from "../features/expense/expenseSlice"; // เพิ่ม reducer นีเข้ามา

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    role: roleReducer,
    calendar: calendarReducer,
    expense: expenseReducer, // เพิ่ม expense เข้าไปใน store
  },
});
