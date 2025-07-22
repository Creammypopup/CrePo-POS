import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

const initialState = {
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getUsers = createAsyncThunk('users/getAll', async (_, thunkAPI) => {
  try {
    return await userService.getUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

// --- START OF EDIT ---
export const updateUser = createAsyncThunk('users/update', async (userData, thunkAPI) => {
    try {
      return await userService.updateUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const deleteUser = createAsyncThunk('users/delete', async (userId, thunkAPI) => {
    try {
        return await userService.deleteUser(userId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});
// --- END OF EDIT ---

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // --- START OF EDIT ---
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
      // --- END OF EDIT ---
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
