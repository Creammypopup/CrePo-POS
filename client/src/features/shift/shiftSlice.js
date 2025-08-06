// client/src/features/shift/shiftSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shiftService from './shiftService';
import { handleApiError } from '../../utils/errorHandler';

const initialState = {
  currentShift: null,
  isLoading: true, // Start with loading true to check for a shift
  isError: false,
  message: '',
};

export const getCurrentShift = createAsyncThunk('shift/getCurrent', async (_, thunkAPI) => {
    try {
        return await shiftService.getCurrentShift();
    } catch (error) {
        return thunkAPI.rejectWithValue(handleApiError(error));
    }
});

export const openShift = createAsyncThunk('shift/open', async (startAmount, thunkAPI) => {
    try {
        return await shiftService.openShift(startAmount);
    } catch (error) {
        return thunkAPI.rejectWithValue(handleApiError(error));
    }
});

export const closeShift = createAsyncThunk('shift/close', async (endAmount, thunkAPI) => {
    try {
        return await shiftService.closeShift(endAmount);
    } catch (error) {
        return thunkAPI.rejectWithValue(handleApiError(error));
    }
});

export const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    reset: (state) => {
        state.isLoading = false;
        state.isError = false;
        state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentShift.pending, (state) => { state.isLoading = true; })
      .addCase(getCurrentShift.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentShift = action.payload;
      })
      .addCase(getCurrentShift.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(openShift.fulfilled, (state, action) => {
        state.currentShift = action.payload;
      })
      .addCase(closeShift.fulfilled, (state) => {
        state.currentShift = null; // Shift is closed
      })
  },
});

export const { reset } = shiftSlice.actions;
export default shiftSlice.reducer;