// client/src/features/calendar/calendarSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarService from './calendarService';

const initialState = {
  events: [], isError: false, isSuccess: false, isLoading: false, message: '',
};

export const getEvents = createAsyncThunk('calendar/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await calendarService.getEvents(token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createEvent = createAsyncThunk('calendar/create', async (eventData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await calendarService.createEvent(eventData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const deleteEvent = createAsyncThunk('calendar/delete', async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await calendarService.deleteEvent(id, token);
      return id; // ส่งแค่ ID กลับไปเพื่อลบออกจาก State
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: { reset: (state) => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => { state.isLoading = true; })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event._id !== action.payload);
      });
  },
});

export const { reset } = calendarSlice.actions;
export default calendarSlice.reducer;