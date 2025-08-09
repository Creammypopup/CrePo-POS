// client/src/features/dashboard/dashboardService.js
import axios from 'axios';

const API_URL = '/api/dashboard/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;
const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const getDashboardStats = async () => {
    try {
        const response = await axios.get(API_URL + 'stats', getConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

const dashboardService = {
    getDashboardStats,
};

export default dashboardService;