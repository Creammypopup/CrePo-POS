import axios from 'axios';

const API_URL = '/api/quotations/';

// Get all quotations
const getQuotations = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create new quotation
const createQuotation = async (quotationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, quotationData, config);
  return response.data;
};

// Get quotation by ID
const getQuotationById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + id, config);
  return response.data;
};

// Update quotation status
const updateQuotationStatus = async (id, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + id + '/status', { status }, config);
  return response.data;
};

const quotationService = {
  getQuotations,
  createQuotation,
  getQuotationById,
  updateQuotationStatus,
};

export default quotationService;
