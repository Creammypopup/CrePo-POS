// client/src/features/sale/saleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import saleService from './saleService';
import { handleApiError } from '../../utils/errorHandler';
import { getProducts } from '../product/productSlice';
import { getCustomers } from '../customer/customerSlice';

const walkInCustomer = { _id: 'walk-in', name: 'ลูกค้าทั่วไป' };

const initialState = {
  cart: [],
  selectedCustomer: walkInCustomer,
  discount: { type: null, value: 0 },
  selectedSale: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const createSale = createAsyncThunk('sale/create', async (saleData, thunkAPI) => {
    try {
        const result = await saleService.createSale(saleData);
        thunkAPI.dispatch(getProducts());
        thunkAPI.dispatch(getCustomers());
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue(handleApiError(error));
    }
});

// --- START OF FIX: Added getSaleById Thunk back ---
export const getSaleById = createAsyncThunk('sale/getById', async (id, thunkAPI) => {
    try {
        return await saleService.getSaleById(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(handleApiError(error));
    }
});
// --- END OF FIX ---

export const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    resetSale: (state) => {
      state.cart = [];
      state.selectedCustomer = walkInCustomer;
      state.discount = { type: null, value: 0 };
      state.selectedSale = null;
    },
    addToCart: (state, action) => {
        const { product, size, quantity, isFreebie = false } = action.payload;
        const itemId = size ? `${product._id}-${size._id}` : product._id;
        const itemInCart = state.cart.find((item) => item.itemId === itemId && !item.isFreebie);

        if (itemInCart) {
            itemInCart.quantity += quantity || 1;
        } else {
            const price = isFreebie ? 0 : (size ? size.price : product.price);
            const cost = size ? size.cost : product.cost;
            state.cart.push({
                ...product,
                itemId,
                productId: product._id,
                quantity: quantity || 1,
                priceAtSale: price,
                originalPrice: price,
                costAtSale: cost,
                unitAtSale: product.mainUnit,
                sizeId: size ? size._id : null,
                sizeName: size ? size.name : null,
                name: size ? `${product.name} - ${size.name}` : product.name,
                isFreebie,
                itemDiscount: { type: 'amount', value: 0 },
            });
        }
    },
    updateCartItem: (state, action) => {
        const { itemId, ...updates } = action.payload;
        const itemIndex = state.cart.findIndex(item => item.itemId === itemId);
        if(itemIndex !== -1) {
            state.cart[itemIndex] = { ...state.cart[itemIndex], ...updates };
        }
    },
    removeFromCart: (state, action) => {
        state.cart = state.cart.filter((item) => item.itemId !== action.payload);
    },
    applyDiscount: (state, action) => {
        state.discount = action.payload;
    },
    selectCustomer: (state, action) => {
        state.selectedCustomer = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(createSale.pending, (state) => { state.isLoading = true; })
        .addCase(createSale.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selectedSale = action.payload; // Keep the created sale for receipt view
            state.cart = [];
            state.selectedCustomer = walkInCustomer;
            state.discount = { type: null, value: 0 };
        })
        .addCase(createSale.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getSaleById.pending, (state) => { state.isLoading = true; })
        .addCase(getSaleById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selectedSale = action.payload;
        })
        .addCase(getSaleById.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
  }
});

export const { resetSale, addToCart, updateCartItem, removeFromCart, applyDiscount, selectCustomer } = saleSlice.actions;
export default saleSlice.reducer;