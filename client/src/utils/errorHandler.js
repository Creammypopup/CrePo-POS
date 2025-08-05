// client/src/utils/errorHandler.js
export const handleApiError = (error) => {
    return (error.response?.data?.message) || error.message || error.toString();
};