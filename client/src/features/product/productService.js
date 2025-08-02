// client/src/features/product/productService.js
import axios from 'axios';

const API_URL = '/api/products/';

// ... (getToken, getConfig)

const getProducts = async () => { /* ... */ };
const createProduct = async (productData) => { /* ... */ };

// --- START OF EDIT ---
const updateProduct = async (productData) => {
  const response = await axios.put(API_URL + productData._id, productData, getConfig());
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(API_URL + id, getConfig());
  return response.data;
};
// --- END OF EDIT ---


const productService = {
  getProducts,
  createProduct,
  updateProduct, // <-- Add this
  deleteProduct, // <-- Add this
};

export default productService;