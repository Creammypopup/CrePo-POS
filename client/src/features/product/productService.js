// client/src/features/product/productService.js
import axios from 'axios';

const API_URL = '/api/products/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all products
const getProducts = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// --- START OF EDIT ---
// Create a new product
const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData, getConfig());
  return response.data;
};
// --- END OF EDIT ---

const productService = {
  getProducts,
  createProduct, // <-- Add this
};

export default productService;