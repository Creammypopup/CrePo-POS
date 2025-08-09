// client/src/features/product/productService.js
import axios from 'axios';

const API_URL = '/api/products/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const getProducts = async () => {
  try {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

const createProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

const updateProduct = async (productData) => {
  try {
    const response = await axios.put(API_URL + productData._id, productData, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(API_URL + id, getConfig());
    return response.data; // Backend returns { id: '...' }
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;