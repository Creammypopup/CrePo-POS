import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from './expenseService';

const initialState = {
  expenses: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getExpenses = createAsyncThunk('expenses/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await expenseService.getExpenses(token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createExpense = createAsyncThunk('expenses/create', async (expenseData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await expenseService.createExpense(expenseData, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateExpense = createAsyncThunk('expenses/update', async (expenseData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.updateExpense(expenseData.id, expenseData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await expenseService.deleteExpense(id, token);
      return id; 
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => { state.isLoading = true; })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses = action.payload;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createExpense.pending, (state) => { state.isLoading = true; })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateExpense.pending, (state) => { state.isLoading = true; })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        );
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteExpense.pending, (state) => { state.isLoading = true; })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = state.expenses.filter((expense) => expense._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = expenseSlice.actions;
export default expenseSlice.reducer;