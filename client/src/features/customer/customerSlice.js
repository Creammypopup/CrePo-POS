// client/src/features/customer/customerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerService from './customerService';
import { handleApiError } from '../../utils/errorHandler';

const initialState = {
  customers: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const getCustomers = createAsyncThunk('customer/getAll', async (_, thunkAPI) => {
    try { return await customerService.getCustomers(); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});
export const createCustomer = createAsyncThunk('customer/create', async (data, thunkAPI) => {
    try { return await customerService.createCustomer(data); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});
export const updateCustomer = createAsyncThunk('customer/update', async (data, thunkAPI) => {
    try { return await customerService.updateCustomer(data); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});
export const deleteCustomer = createAsyncThunk('customer/delete', async (id, thunkAPI) => {
    try { await customerService.deleteCustomer(id); return id; } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: { reset: (state) => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => { state.isLoading = true; })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.map((c) => c._id === action.payload._id ? action.payload : c);
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter((c) => c._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      );
  },
});

export const { reset } = customerSlice.actions;
export default customerSlice.reducer;