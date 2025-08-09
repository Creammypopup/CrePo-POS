import axios from 'axios';

const API_URL = '/api/roles/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all roles
const getRoles = async () => {
  try {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Create a new role
const createRole = async (roleData) => {
  try {
    const response = await axios.post(API_URL, roleData, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Update a role
const updateRole = async (roleData) => {
  try {
    // FIXED: Changed roleData.id to roleData._id
    const response = await axios.put(API_URL + roleData._id, roleData, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Delete a role
const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(API_URL + roleId, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

const roleService = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};

export default roleService;