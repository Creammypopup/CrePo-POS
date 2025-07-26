import axios from 'axios';

const API_URL = '/api/expenses/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all expenses
const getExpenses = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// Create a new expense
const createExpense = async (expenseData) => {
  const response = await axios.post(API_URL, expenseData, getConfig());
  return response.data;
};

// Update an expense
const updateExpense = async (expenseData) => {
    const response = await axios.put(API_URL + expenseData.id, expenseData, getConfig());
    return response.data;
};

// Delete an expense
const deleteExpense = async (expenseId) => {
    const response = await axios.delete(API_URL + expenseId, getConfig());
    return response.data;
};

const expenseService = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};

export default expenseService;