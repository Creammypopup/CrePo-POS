// client/src/features/calendar/calendarService.js
import axios from 'axios';

// API URL สำหรับ User Events ของเราเอง
const API_URL = '/api/calendar/';

// API URL สำหรับดึงข้อมูลผ่าน Proxy ของเรา
const PROXY_API_URL = '/api/proxy/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ฟังก์ชันใหม่: ดึงข้อมูลวันหยุดและวันพระผ่าน Proxy ที่เสถียรกว่า
const getPublicEvents = async () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  try {
    // ดึงข้อมูลพร้อมกัน 3 อย่าง
    const [holidays, wanpraCurrent, wanpraNext] = await Promise.all([
      axios.get(`${PROXY_API_URL}holidays/${currentYear}`, getConfig()),
      axios.get(`${PROXY_API_URL}wanpra/${currentYear}`, getConfig()),
      axios.get(`${PROXY_API_URL}wanpra/${nextYear}`, getConfig())
    ]);

    // จัดรูปแบบข้อมูลวันหยุด
    const formattedHolidays = holidays.data.map(event => ({
      _id: `${event.date}-${event.localName}`,
      title: event.localName,
      start: event.date,
      allDay: true,
      type: 'holiday', // กำหนดประเภทให้ชัดเจน
    }));
    
    // จัดรูปแบบข้อมูลวันพระ
    const allWanpra = [...wanpraCurrent.data, ...wanpraNext.data];
    const formattedWanpra = allWanpra.flatMap(month => 
      month.events.map(event => ({
        _id: `${month.date}-${event.title}`,
        title: event.title,
        start: event.date,
        allDay: true,
        type: event.isHolyDay ? 'buddhist-major' : 'buddhist-minor', // กำหนดประเภทให้ชัดเจนจากข้อมูลที่ได้มา
      }))
    );
    
    return [...formattedHolidays, ...formattedWanpra];

  } catch (error) {
    console.error("Error fetching public events:", error);
    return []; // ถ้ามีปัญหา ให้ trả về array ว่าง
  }
};


// ฟังก์ชันสำหรับจัดการ Event ของ User (ยังเหมือนเดิม)
const getEvents = async (token) => {
  const userEvents = await axios.get(API_URL, getConfig());
  const publicEvents = await getPublicEvents();
  return [...userEvents.data, ...publicEvents]; // รวม Event ของ User และ Event สาธารณะ
};

const createEvent = async (eventData, token) => {
  const response = await axios.post(API_URL, eventData, getConfig());
  return response.data;
};

const deleteEvent = async (eventId, token) => {
  const response = await axios.delete(API_URL + eventId, getConfig());
  return response.data;
};

const calendarService = {
  getEvents,
  createEvent,
  deleteEvent,
};

export default calendarService;