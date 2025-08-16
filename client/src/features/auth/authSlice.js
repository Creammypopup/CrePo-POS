import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      // **START OF EDIT: ส่ง token ไปด้วย**
      const token = thunkAPI.getState().auth.user.token;
      return await authService.register(userData, token);
      // **END OF EDIT**
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, thunkAPI) => {
    // Temporarily return a dummy user to bypass authentication
    return { _id: 'dummyUserId', name: 'Dummy User', email: 'dummy@example.com', role: 'admin', token: 'dummyToken' };
  }
);

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
    // **START OF EDIT: เพิ่ม resetSuccess**
    resetSuccess: (state) => {
      state.isSuccess = false;
    }
    // **END OF EDIT**
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // ไม่ต้องตั้งค่า user ที่นี่แล้ว ป้องกันการ login อัตโนมัติ
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        const token = state.user.token;
        state.user = action.payload;
        state.user.token = token;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.user = null;
        localStorage.removeItem('user');
      });
  },
});

export const { reset, resetSuccess } = authSlice.actions; // **เพิ่ม export**
export default authSlice.reducer;