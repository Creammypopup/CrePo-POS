// client/src/features/report/reportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from './reportService';
import { handleApiError } from '../../utils/errorHandler';

const initialState = {
  salesReport: { sales: [], summary: {} },
  inventoryReport: { products: [], summary: {} },
  pawnReport: { pawns: [], summary: {} },
  isLoading: false,
  isError: false,
  message: '',
};

export const getSalesReport = createAsyncThunk('report/getSalesReport', async (dateRange, thunkAPI) => {
    try { return await reportService.getSalesReport(dateRange); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});

export const getInventoryReport = createAsyncThunk('report/getInventoryReport', async (_, thunkAPI) => {
    try { return await reportService.getInventoryReport(); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});

export const getPawnReport = createAsyncThunk('report/getPawnReport', async (_, thunkAPI) => {
    try { return await reportService.getPawnReport(); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: { reset: (state) => initialState, },
  extraReducers: (builder) => {
    builder
      .addCase(getSalesReport.pending, (state) => { state.isLoading = true; })
      .addCase(getSalesReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesReport = action.payload;
      })
      .addCase(getInventoryReport.pending, (state) => { state.isLoading = true; })
      .addCase(getInventoryReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inventoryReport = action.payload;
      })
      .addCase(getPawnReport.pending, (state) => { state.isLoading = true; })
      .addCase(getPawnReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pawnReport = action.payload;
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

export const { reset } = reportSlice.actions;
export default reportSlice.reducer;