// client/src/features/supplier/supplierService.js
import axios from 'axios';

const API_URL = '/api/suppliers/';
const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;
const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const getSuppliers = async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
};

const createSupplier = async (supplierData) => {
    const response = await axios.post(API_URL, supplierData, getConfig());
    return response.data;
};

const updateSupplier = async (supplierData) => {
    const response = await axios.put(API_URL + supplierData._id, supplierData, getConfig());
    return response.data;
};

const deleteSupplier = async (id) => {
    const response = await axios.delete(API_URL + id, getConfig());
    return response.data;
};

const supplierService = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
export default supplierService;