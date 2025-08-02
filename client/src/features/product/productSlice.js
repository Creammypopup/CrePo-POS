// client/src/features/product/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from './productService';

const initialState = {
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getProducts = createAsyncThunk('products/getAll', async (_, thunkAPI) => {
  // ... (code remains the same)
});

// --- START OF EDIT ---
export const createProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
  try {
    return await productService.createProduct(productData);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
// --- END OF EDIT ---

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => { /* ... */ })
      .addCase(getProducts.fulfilled, (state, action) => { /* ... */ })
      .addCase(getProducts.rejected, (state, action) => { /* ... */ })
      // --- START OF EDIT ---
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true; // Show loading state while creating
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload); // Add new product to the top of the list
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
      // --- END OF EDIT ---
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;