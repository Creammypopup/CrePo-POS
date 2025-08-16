    // client/src/features/settings/settingService.js
    import axios from 'axios';

    const API_URL = '/api/settings/';

    const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

    const getConfig = () => ({
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    // Get settings
    const getSettings = async () => {
      try {
        const response = await axios.get(API_URL, getConfig());
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || error.message;
      }
    };

    // Update settings
    const updateSettings = async (settingsData) => {
      try {
        const response = await axios.put(API_URL, settingsData, getConfig());
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || error.message;
      }
    };

    const settingService = {
      getSettings,
      updateSettings,
    };

    export default settingService;
    