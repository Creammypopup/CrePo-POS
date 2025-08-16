import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quotationService from './quotationService';

const initialState = {
  quotations: [],
  quotation: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all quotations
export const getQuotations = createAsyncThunk('quotations/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await quotationService.getQuotations(token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create new quotation
export const createQuotation = createAsyncThunk('quotations/create', async (quotationData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await quotationService.createQuotation(quotationData, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get single quotation
export const getQuotationById = createAsyncThunk('quotations/getOne', async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await quotationService.getQuotationById(id, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  });

// Update quotation status
export const updateQuotationStatus = createAsyncThunk('quotations/updateStatus', async ({ id, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await quotationService.updateQuotationStatus(id, status, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  });

export const quotationSlice = createSlice({
  name: 'quotations',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuotations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuotations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.quotations = action.payload;
      })
      .addCase(getQuotations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createQuotation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.quotations.push(action.payload);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getQuotationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuotationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.quotation = action.payload;
      })
      .addCase(getQuotationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateQuotationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.quotations.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.quotations[index] = action.payload;
        }
        if (state.quotation?._id === action.payload._id) {
            state.quotation = action.payload;
        }
      });
  },
});

export const { reset } = quotationSlice.actions;
export default quotationSlice.reducer;
