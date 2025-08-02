// client/src/features/category/categoryService.js
import axios from 'axios';

const API_URL = '/api/categories/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all categories
const getCategories = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// Create a new category
const createCategory = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData, getConfig());
  return response.data;
};

// Delete a category
const deleteCategory = async (categoryId) => {
  const response = await axios.delete(API_URL + categoryId, getConfig());
  return response.data;
};

const categoryService = {
  getCategories,
  createCategory,
  deleteCategory,
};

export default categoryService;