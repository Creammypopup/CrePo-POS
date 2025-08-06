// client/src/features/dashboard/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from './dashboardService';
import { handleApiError } from '../../utils/errorHandler';

const initialState = {
    stats: {
        totalSalesValue: 0,
        totalItemsSold: 0,
        topProductsToday: [],
        lowStockProducts: [],
        expiringProducts: [], // <-- ADD THIS LINE
        overduePawns: [],     // <-- ADD THIS LINE
    },
    isLoading: true,
    isError: false,
    message: '',
};

export const getDashboardStats = createAsyncThunk('dashboard/getStats', async (_, thunkAPI) => {
    try {
        return await dashboardService.getDashboardStats();
    } catch (error) {
        return thunkAPI.rejectWithValue(handleApiError(error));
    }
});

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;