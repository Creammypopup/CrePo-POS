import axios from 'axios';

const API_URL = '/api/calendar/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all calendar events
const getEvents = async () => {
  const response = await axios.get(API_URL, getConfig());
  // Convert date strings from ISO format to Date objects
  return response.data.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
};

// Create a new event
const createEvent = async (eventData) => {
  const response = await axios.post(API_URL, eventData, getConfig());
  return {
    ...response.data,
    start: new Date(response.data.start),
    end: new Date(response.data.end),
  };
};

const calendarService = {
  getEvents,
  createEvent,
};

export default calendarService;