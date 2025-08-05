// client/src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import roleReducer from "../features/role/roleSlice";
import calendarReducer from "../features/calendar/calendarSlice";
import expenseReducer from "../features/expense/expenseSlice";
import settingReducer from "../features/settings/settingSlice";
import categoryReducer from "../features/category/categorySlice";
import productReducer from "../features/product/productSlice"; 
import productCategoryReducer from "../features/productCategory/productCategorySlice";
import customerReducer from "../features/customer/customerSlice";
import supplierReducer from "../features/supplier/supplierSlice";
// --- START OF EDIT ---
import saleReducer from "../features/sale/saleSlice";
// --- END OF EDIT ---

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    role: roleReducer,
    calendar: calendarReducer,
    expense: expenseReducer,
    settings: settingReducer,
    category: categoryReducer,
    products: productReducer,
    productCategories: productCategoryReducer,
    customers: customerReducer,
    suppliers: supplierReducer,
    // --- START OF EDIT ---
    sale: saleReducer,
    // --- END OF EDIT ---
  },
});