// client/src/features/sale/saleService.js
import axios from 'axios';

const API_URL = '/api/sales/';
const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;
const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const createSale = async (saleData) => {
    try {
        const response = await axios.post(API_URL, saleData, getConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

const getSaleById = async (id) => {
    try {
        const response = await axios.get(API_URL + id, getConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

const saleService = {
    createSale,
    getSaleById,
};

export default saleService;