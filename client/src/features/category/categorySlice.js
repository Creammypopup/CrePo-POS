// src/features/category/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from './categoryService';

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Async Thunks
export const getCategories = createAsyncThunk('category/getAll', async (_, thunkAPI) => {
    try {
        return await categoryService.getCategories();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createCategory = createAsyncThunk('category/create', async (categoryData, thunkAPI) => {
    try {
        return await categoryService.createCategory(categoryData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteCategory = createAsyncThunk('category/delete', async (id, thunkAPI) => {
    try {
        await categoryService.deleteCategory(id);
        return id;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
      builder
          .addCase(getCategories.pending, (state) => { state.isLoading = true; })
          .addCase(getCategories.fulfilled, (state, action) => {
              state.isLoading = false;
              state.categories = action.payload;
          })
          .addCase(getCategories.rejected, (state, action) => {
              state.isLoading = false;
              state.isError = true;
              state.message = action.payload;
          })
          .addCase(createCategory.fulfilled, (state, action) => {
              state.categories.push(action.payload);
          })
          .addCase(deleteCategory.fulfilled, (state, action) => {
              state.categories = state.categories.filter(cat => cat._id !== action.payload);
          });
  },
});

export const { reset } = categorySlice.actions;
export default categorySlice.reducer;