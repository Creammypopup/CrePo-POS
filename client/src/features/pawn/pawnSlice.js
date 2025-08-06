// client/src/features/pawn/pawnSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pawnService from './pawnService';
import { handleApiError } from '../../utils/errorHandler';

const initialState = {
  pawns: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const getPawns = createAsyncThunk('pawn/getAll', async (_, thunkAPI) => {
    try { return await pawnService.getPawns(); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});

export const createPawn = createAsyncThunk('pawn/create', async (data, thunkAPI) => {
    try { return await pawnService.createPawn(data); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});

export const updatePawn = createAsyncThunk('pawn/update', async (data, thunkAPI) => {
    try { return await pawnService.updatePawn(data); } catch (error) { return thunkAPI.rejectWithValue(handleApiError(error)); }
});

export const deletePawn = createAsyncThunk('pawn/delete', async (id, thunkAPI) => {
    try { 
        await pawnService.deletePawn(id);
        return id;
    } catch (error) { 
        return thunkAPI.rejectWithValue(handleApiError(error)); 
    }
});

export const pawnSlice = createSlice({
  name: 'pawn',
  initialState,
  reducers: { reset: (state) => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(getPawns.pending, (state) => { state.isLoading = true; })
      .addCase(getPawns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pawns = action.payload;
      })
      .addCase(createPawn.fulfilled, (state, action) => {
        state.pawns.unshift(action.payload);
      })
      .addCase(updatePawn.fulfilled, (state, action) => {
        state.pawns = state.pawns.map(p => p._id === action.payload._id ? action.payload : p);
      })
      .addCase(deletePawn.fulfilled, (state, action) => {
        state.pawns = state.pawns.filter(p => p._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      );
  },
});

export const { reset } = pawnSlice.actions;
export default pawnSlice.reducer;