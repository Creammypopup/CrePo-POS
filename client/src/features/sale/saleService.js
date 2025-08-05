// client/src/features/sale/saleService.js
import axios from 'axios';

const API_URL = '/api/sales/';
const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;
const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const createSale = async (saleData) => {
    const response = await axios.post(API_URL, saleData, getConfig());
    return response.data;
};

const saleService = {
    createSale,
};

export default saleService;