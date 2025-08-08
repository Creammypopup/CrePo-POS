import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = '/api/sales/';

const initialState = {
  cart: [],
  selectedSale: null,
  selectedCustomer: { _id: 'walk-in', name: 'ลูกค้าทั่วไป' },
  discount: { type: 'amount', value: 0 },
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Async Thunk for creating a sale
export const createSale = createAsyncThunk('sale/create', async (saleData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, saleData, config);
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Async Thunk for getting a single sale by ID
export const getSaleById = createAsyncThunk('sale/getById', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + id, config);
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});


export const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, size, priceAtSale } = action.payload;
      const itemId = size ? `${product._id}-${size._id}` : product._id;
      const existingItem = state.cart.find((item) => item.itemId === itemId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({
          itemId,
          productId: product._id,
          sizeId: size ? size._id : null,
          name: size ? `${product.name} (${size.name})` : product.name,
          quantity: 1,
          priceAtSale,
          originalPrice: priceAtSale,
          costAtSale: size ? size.cost : product.cost,
          stock: size ? size.stock : product.stock,
          productType: product.productType,
        });
      }
    },
    updateCartItem: (state, action) => {
      const { itemId, ...updates } = action.payload;
      const itemIndex = state.cart.findIndex((item) => item.itemId === itemId);
      if (itemIndex !== -1) {
        if (updates.quantity !== undefined && updates.quantity <= 0) {
          state.cart.splice(itemIndex, 1); // Remove if quantity is 0 or less
        } else {
          state.cart[itemIndex] = { ...state.cart[itemIndex], ...updates };
        }
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.itemId !== action.payload);
    },
    selectCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    applyDiscount: (state, action) => {
      state.discount = action.payload;
    },
    resetSale: (state) => {
      state.cart = [];
      state.discount = { type: 'amount', value: 0 };
      state.selectedSale = null;
      // Keep selectedCustomer
    },
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
        state.discount = { type: 'amount', value: 0 };
        toast.success(`บันทึกการขายสำเร็จ! เลขที่: ${action.payload._id.slice(-6)}`);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getSaleById.pending, (state) => {
        state.isLoading = true;
        state.selectedSale = null;
      })
      .addCase(getSaleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedSale = action.payload;
      })
      .addCase(getSaleById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  selectCustomer,
  applyDiscount,
  resetSale,
} = saleSlice.actions;

export default saleSlice.reducer;