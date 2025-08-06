// client/src/features/shift/shiftService.js
import axios from 'axios';

const API_URL = '/api/shifts/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;
const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const getCurrentShift = async () => {
    const response = await axios.get(API_URL + 'current', getConfig());
    return response.data;
};

const openShift = async (startAmount) => {
    const response = await axios.post(API_URL + 'open', { startAmount }, getConfig());
    return response.data;
};

const closeShift = async (endAmount) => {
    const response = await axios.post(API_URL + 'close', { endAmount }, getConfig());
    return response.data;
};

const shiftService = {
    getCurrentShift,
    openShift,
    closeShift,
};

export default shiftService;