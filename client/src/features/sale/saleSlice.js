// client/src/features/sale/saleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import saleService from './saleService';
import { handleApiError } from '../../utils/errorHandler';

const initialState = {
  cart: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const createSale = createAsyncThunk('sale/create', async (saleData, thunkAPI) => {
    try {
        return await saleService.createSale(saleData);
    } catch (error) {
        return thunkAPI.rejectWithValue(handleApiError(error));
    }
});

export const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    reset: (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
    },
    addToCart: (state, action) => {
        const itemInCart = state.cart.find((item) => item._id === action.payload._id);
        if (itemInCart) {
            itemInCart.quantity++;
        } else {
            state.cart.push({ ...action.payload, quantity: 1 });
        }
    },
    incrementQuantity: (state, action) => {
        const item = state.cart.find((item) => item._id === action.payload);
        item.quantity++;
    },
    decrementQuantity: (state, action) => {
        const item = state.cart.find((item) => item._id === action.payload);
        if (item.quantity === 1) {
            item.quantity = 1;
        } else {
            item.quantity--;
        }
    },
    removeFromCart: (state, action) => {
        state.cart = state.cart.filter((item) => item._id !== action.payload);
    },
    clearCart: (state) => {
        state.cart = [];
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(createSale.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createSale.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.cart = []; // Clear cart on successful sale
        })
        .addCase(createSale.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
  }
});

export const { reset, addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = saleSlice.actions;
export default saleSlice.reducer;