// src/features/category/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    { id: '1', name: 'ค่าเดินทาง', source: 'กำไร' },
    { id: '2', name: 'ค่าอาหาร', source: 'กำไร' },
    { id: '3', name: 'ค่าวัตถุดิบ', source: 'ทุน' },
    { id: '4', name: 'ค่าจ้าง', source: 'กำไร' },
    { id: '5', name: 'ค่าปูน', source: 'ทุน' },
  ],
  isLoading: false,
  isError: false,
  message: '',
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const newCategory = { 
        id: new Date().getTime().toString(), 
        name: action.payload.name,
        source: action.payload.source 
      };
      state.categories.push(newCategory);
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    },
  },
});

export const { addCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;