// client/src/features/productCategory/productCategorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productCategoryService from './productCategoryService';
import { toast } from 'react-toastify';

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const getProductCategories = createAsyncThunk('productCategory/getAll', async (_, thunkAPI) => {
    try {
        return await productCategoryService.getProductCategories();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createProductCategory = createAsyncThunk('productCategory/create', async (categoryData, thunkAPI) => {
    try {
        const newCategory = await productCategoryService.createProductCategory(categoryData);
        toast.success(`เพิ่มหมวดหมู่ "${newCategory.name}" สำเร็จ!`);
        return newCategory;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

// --- START OF EDIT ---
export const deleteProductCategory = createAsyncThunk('productCategory/delete', async (id, thunkAPI) => {
    try {
        await productCategoryService.deleteProductCategory(id);
        toast.success('ลบหมวดหมู่สำเร็จ');
        return id;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});
// --- END OF EDIT ---

export const productCategorySlice = createSlice({
  name: 'productCategory',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
      builder
          .addCase(getProductCategories.pending, (state) => { state.isLoading = true; })
          .addCase(getProductCategories.fulfilled, (state, action) => {
              state.isLoading = false;
              state.categories = action.payload;
          })
          .addCase(getProductCategories.rejected, (state, action) => {
              state.isLoading = false;
              state.isError = true;
              state.message = action.payload;
          })
          .addCase(createProductCategory.fulfilled, (state, action) => {
              state.categories.push(action.payload);
          })
          // --- START OF EDIT ---
          .addCase(deleteProductCategory.fulfilled, (state, action) => {
              state.categories = state.categories.filter(cat => cat._id !== action.payload);
          });
          // --- END OF EDIT ---
  },
});

export const { reset } = productCategorySlice.actions;
export default productCategorySlice.reducer;