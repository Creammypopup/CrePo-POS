// client/src/features/sale/saleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import saleService from './saleService';
import { handleApiError } from '../../utils/errorHandler';
import { getProducts } from '../product/productSlice'; // Import to refresh stock

const walkInCustomer = { _id: 'walk-in', name: 'ลูกค้าทั่วไป' };

const initialState = {
  cart: [],
  selectedCustomer: walkInCustomer,
  heldBills: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const createSale = createAsyncThunk('sale/create', async (saleData, thunkAPI) => {
    try {
        const result = await saleService.createSale(saleData);
        thunkAPI.dispatch(getProducts()); // Re-fetch products to update stock
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue(handleApiError(error));
    }
});

export const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    resetSale: (state) => {
      state.cart = [];
      state.selectedCustomer = walkInCustomer;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    selectCustomer: (state, action) => {
        state.selectedCustomer = action.payload;
    },
    clearCustomer: (state) => {
        state.selectedCustomer = walkInCustomer;
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
        if(item) item.quantity++;
    },
    decrementQuantity: (state, action) => {
        const item = state.cart.find((item) => item._id === action.payload);
        if (item && item.quantity > 1) {
            item.quantity--;
        }
    },
    removeFromCart: (state, action) => {
        state.cart = state.cart.filter((item) => item._id !== action.payload);
    },
    clearCart: (state) => {
        state.cart = [];
        state.selectedCustomer = walkInCustomer;
    },
    holdBill: (state) => {
        if (state.cart.length > 0) {
            state.heldBills.push({
                cart: state.cart,
                customer: state.selectedCustomer,
                timestamp: new Date().toISOString()
            });
            state.cart = [];
            state.selectedCustomer = walkInCustomer;
        }
    },
    recallBill: (state, action) => {
        const billToRecall = state.heldBills[action.payload];
        if (billToRecall) {
            state.cart = billToRecall.cart;
            state.selectedCustomer = billToRecall.customer;
            state.heldBills.splice(action.payload, 1);
        }
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(createSale.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createSale.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.cart = [];
            state.selectedCustomer = walkInCustomer;
        })
        .addCase(createSale.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
  }
});

export const { resetSale, addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart, selectCustomer, clearCustomer, holdBill, recallBill } = saleSlice.actions;
export default saleSlice.reducer;