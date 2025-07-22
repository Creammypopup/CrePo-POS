const Event = require('../models/Event');
const { sendLineNotify } = require('../services/notificationService');
// CORRECTED: Import the function from the new helper file
const { getBuddhistHolyDays } = require('../utils/holyDayHelper');

// @desc    Get all events including Buddhist Holy Days
// @route   GET /api/calendar
// @access  Private
const getEvents = async (req, res) => {
  try {
    const userEvents = await Event.find({ user: req.user.id });
    // Use the current year to get holy days
    const holyDays = getBuddhistHolyDays(new Date().getFullYear());
    
    // Combine user's events and holy days
    const allEvents = [...userEvents, ...holyDays];
    res.status(200).json(allEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new event
// @route   POST /api/calendar
// @access  Private
const createEvent = async (req, res) => {
  const { title, start, end, allDay } = req.body;

  if (!title || !start || !end) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const event = await Event.create({
      title,
      start,
      end,
      allDay,
      user: req.user.id,
    });
    
    // Send notification
    const eventDate = new Date(start).toLocaleDateString('th-TH', { day: 'numeric', month: 'long' });
    sendLineNotify(`สร้างกิจกรรมใหม่: "${title}" ในวันที่ ${eventDate}`);

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
};