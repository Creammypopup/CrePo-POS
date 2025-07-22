import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  permissions: user?.role?.permissions || [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isAuthLoading: true, // For initial auth check
  message: '',
};

// --- START OF COMPLETE FIX: Ensure all async thunks are created and exported ---

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      const message =
        (error.response?.data?.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response?.data?.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

// Get current user data
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        return await authService.getMe();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        // Automatically log out if getMe fails to prevent loops
        thunkAPI.dispatch(logout());
        return thunkAPI.rejectWithValue(message);
    }
});
// --- END OF COMPLETE FIX ---

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.permissions = action.payload?.role?.permissions || [];
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.permissions = [];
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.permissions = [];
        state.isAuthLoading = false; // Stop loading on logout
      })
      // GetMe
      .addCase(getMe.pending, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
          state.isAuthLoading = false;
          state.user = action.payload;
          state.permissions = action.payload?.role?.permissions || [];
      })
      .addCase(getMe.rejected, (state, action) => {
          state.isAuthLoading = false;
          state.user = null;
          state.permissions = [];
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
