import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarService from './calendarService';

const initialState = {
  events: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Async Thunks
export const getEvents = createAsyncThunk('calendar/getAll', async (_, thunkAPI) => {
  try {
    return await calendarService.getEvents();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

export const createEvent = createAsyncThunk('calendar/create', async (eventData, thunkAPI) => {
  try {
    return await calendarService.createEvent(eventData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});


// Slice
export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Events
      .addCase(getEvents.pending, (state) => { state.isLoading = true; })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
  },
});

export const { reset } = calendarSlice.actions;
export default calendarSlice.reducer;