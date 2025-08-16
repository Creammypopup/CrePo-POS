import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/product/productSlice';
import productCategoryReducer from '../features/productCategory/productCategorySlice';
import categoryReducer from '../features/category/categorySlice'; // For expenses
import saleReducer from '../features/sale/saleSlice';
import customerReducer from '../features/customer/customerSlice';
import supplierReducer from '../features/supplier/supplierSlice';
import expenseReducer from '../features/expense/expenseSlice';
import pawnReducer from '../features/pawn/pawnSlice';
import roleReducer from '../features/role/roleSlice';
import shiftReducer from '../features/shift/shiftSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import settingsReducer from '../features/settings/settingsSlice';
import quotationReducer from '../features/quotation/quotationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    productCategories: productCategoryReducer,
    category: categoryReducer, // For expenses
    sale: saleReducer,
    customers: customerReducer,
    suppliers: supplierReducer,
    expense: expenseReducer,
    pawn: pawnReducer,
    role: roleReducer,
    shift: shiftReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
    quotations: quotationReducer,
  },
});
