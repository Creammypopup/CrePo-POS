import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  settings: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    // TODO: Add async thunks for getting/updating settings later
  },
});

export const { reset } = settingsSlice.actions;
export default settingsSlice.reducer;