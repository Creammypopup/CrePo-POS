// client/src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import roleReducer from "../features/role/roleSlice";
import calendarReducer from "../features/calendar/calendarSlice";
import expenseReducer from "../features/expense/expenseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer, // <-- **แก้ไขจาก user เป็น users**
    roles: roleReducer, // <-- **แก้ไขจาก role เป็น roles**
    calendar: calendarReducer,
    expense: expenseReducer,
  },
});