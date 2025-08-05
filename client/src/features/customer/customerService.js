// client/src/features/customer/customerService.js
import axios from 'axios';

const API_URL = '/api/customers/';
const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;
const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const getCustomers = async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
};

const createCustomer = async (customerData) => {
    const response = await axios.post(API_URL, customerData, getConfig());
    return response.data;
};

const updateCustomer = async (customerData) => {
    const response = await axios.put(API_URL + customerData._id, customerData, getConfig());
    return response.data;
};

const deleteCustomer = async (id) => {
    const response = await axios.delete(API_URL + id, getConfig());
    return response.data;
};

const customerService = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
export default customerService;