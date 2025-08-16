import axios from 'axios';

const API_URL = '/api/users/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all users
const getUsers = async () => {
  try {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// --- START OF EDIT ---
// Update a user
const updateUser = async (userData) => {
  try {
    const response = await axios.put(API_URL + userData.id, userData, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Delete a user
const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(API_URL + userId, getConfig());
    // The backend returns a success message, but we'll return the ID for the slice
    return userId;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};
// --- END OF EDIT ---

const userService = {
  getUsers,
  updateUser,
  deleteUser,
};

export default userService;
