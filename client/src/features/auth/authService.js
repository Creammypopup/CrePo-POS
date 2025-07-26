import axios from 'axios';

const API_URL = '/api/users/';

// **START OF EDIT: แก้ไข register ให้รับ token**
const register = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'register', userData, config);
  return response.data;
};
// **END OF EDIT**

const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getMe = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'me', config);
    return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
};

export default authService;