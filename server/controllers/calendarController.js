const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const { getPublicHolidays } = require('../utils/holidayHelper'); // Updated import

// @desc    Get all events for a user, including public holidays
// @route   GET /api/calendar
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  // 1. Get user-specific events
  const userEvents = await Event.find({ user: req.user.id });

  // 2. Get public holidays (for now, using our helper)
  const currentYear = new Date().getFullYear();
  const holidays = getPublicHolidays(currentYear);

  // You can easily add next year's holidays too
  const nextYearHolidays = getPublicHolidays(currentYear + 1);

  // 3. Combine them all
  const allEvents = [...userEvents, ...holidays, ...nextYearHolidays];

  res.status(200).json(allEvents);
});


// ... (ส่วนที่เหลือของไฟล์ไม่ต้องแก้ไข) ...

// @desc    Create a new event
// @route   POST /api/calendar
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, allDay, type } = req.body;

  if (!title || !start || !end) {
    res.status(400);
    throw new Error('Please provide all required fields: title, start, end');
  }

  const event = await Event.create({
    user: req.user.id,
    title,
    start: new Date(start),
    end: new Date(end),
    allDay: allDay || false,
    type: type || 'user', // Default type is 'user'
  });

  res.status(201).json(event);
});

// @desc    Update an event
// @route   PUT /api/calendar/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Ensure user can only update their own events
  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedEvent);
});

// @desc    Delete an event
// @route   DELETE /api/calendar/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Ensure user can only delete their own events
  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await event.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Event removed' });
});

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};