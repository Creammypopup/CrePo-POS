// client/src/features/supplier/supplierSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supplierService from './supplierService';
import { handleApiError } from '../../utils/errorHandler';

const initialState = {
  suppliers: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const getSuppliers = createAsyncThunk('supplier/getAll', async (_, thunkAPI) => {
    try { return await supplierService.getSuppliers(); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});
export const createSupplier = createAsyncThunk('supplier/create', async (data, thunkAPI) => {
    try { return await supplierService.createSupplier(data); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});
export const updateSupplier = createAsyncThunk('supplier/update', async (data, thunkAPI) => {
    try { return await supplierService.updateSupplier(data); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});
export const deleteSupplier = createAsyncThunk('supplier/delete', async (id, thunkAPI) => {
    try { await supplierService.deleteSupplier(id); return id; } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});

export const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: { reset: (state) => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(getSuppliers.pending, (state) => { state.isLoading = true; })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.map((s) => s._id === action.payload._id ? action.payload : s);
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter((s) => s._id !== action.payload);
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

export const { reset } = supplierSlice.actions;
export default supplierSlice.reducer;