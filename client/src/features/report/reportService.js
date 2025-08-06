// client/src/features/report/reportService.js
import axios from 'axios';

const API_URL = '/api/reports/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;
const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const getSalesReport = async (dateRange) => {
    const config = getConfig();
    config.params = dateRange;
    const response = await axios.get(API_URL + 'sales', config);
    return response.data;
};

const getInventoryReport = async () => {
    const response = await axios.get(API_URL + 'inventory', getConfig());
    return response.data;
};

const getPawnReport = async () => {
    const response = await axios.get(API_URL + 'pawn', getConfig());
    return response.data;
};

const reportService = {
    getSalesReport,
    getInventoryReport,
    getPawnReport,
};

export default reportService;