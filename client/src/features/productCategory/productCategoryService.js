// client/src/features/productCategory/productCategoryService.js
import axios from 'axios';

const API_URL = '/api/product-categories/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all product categories
const getProductCategories = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// Create a new product category
const createProductCategory = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData, getConfig());
  return response.data;
};

// --- START OF EDIT ---
// Delete a product category
const deleteProductCategory = async (categoryId) => {
    const response = await axios.delete(API_URL + categoryId, getConfig());
    return response.data;
}

const productCategoryService = {
  getProductCategories,
  createProductCategory,
  deleteProductCategory,
};
// --- END OF EDIT ---

export default productCategoryService;