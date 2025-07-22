import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// รับข้อมูลผู้ใช้จาก localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// ลงทะเบียนผู้ใช้
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
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

// เข้าสู่ระบบผู้ใช้
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error)
    {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// ออกจากระบบ
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

// ตรวจสอบสถานะการยืนยันตัวตน
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, thunkAPI) => {
    try {
      // ดึง token จาก state ของ auth อย่างปลอดภัย
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        // หากไม่มี token ให้ปฏิเสธ (reject) เพื่อไปยังหน้า login
        return thunkAPI.rejectWithValue('No token found');
      }
      // ส่ง token ไปให้ service เพื่อตรวจสอบกับ server
      return await authService.getMe(token);
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
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
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
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // ข้อมูล user มาจากการโหลด state เริ่มต้น (จาก localStorage)
        // action.payload คือข้อมูล user ที่อัปเดตจาก server
        // เรารวมข้อมูลใหม่ แต่ต้องแน่ใจว่า token ไม่หายไป
        const token = state.user.token;
        state.user = action.payload; // ข้อมูลใหม่จาก server
        state.user.token = token; // ใส่ token กลับเข้าไป
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = false; // ไม่ใช่ error จริงจัง แค่ยังไม่ได้ login
        state.message = action.payload;
        state.user = null;
        // สิ่งสำคัญ: ลบข้อมูลผู้ใช้ที่ไม่ถูกต้องออกจาก storage
        localStorage.removeItem('user');
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
