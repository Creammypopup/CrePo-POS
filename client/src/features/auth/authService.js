import axios from 'axios';

const API_URL = '/api/users/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

// Register user
const register = async (userData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  const response = await axios.post(API_URL + 'register', userData, config);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// --- START OF FIX ---
// Get user data - แก้ไข: ไม่ต้องรับ token เป็นพารามิเตอร์แล้ว
const getMe = async () => {
    const token = getToken(); // ดึง token จากที่นี่โดยตรง
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'me', config);
    return response.data;
};
// --- END OF FIX ---

const authService = {
  register,
  login,
  logout,
  getMe,
};

export default authService;
