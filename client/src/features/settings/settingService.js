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
      const response = await axios.get(API_URL, getConfig());
      return response.data;
    };

    // Update settings
    const updateSettings = async (settingsData) => {
      const response = await axios.put(API_URL, settingsData, getConfig());
      return response.data;
    };

    const settingService = {
      getSettings,
      updateSettings,
    };

    export default settingService;
    