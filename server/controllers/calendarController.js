const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events for a user
// @route   GET /api/calendar
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  // ค้นหากิจกรรมทั้งหมดที่ 'user' field ตรงกับ id ของผู้ใช้ที่ล็อกอินอยู่
  const events = await Event.find({ user: req.user.id });
  res.status(200).json(events);
});

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
    type: type || 'user', // ถ้าไม่ระบุ ให้เป็น 'user' โดยอัตโนมัติ
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

  // ตรวจสอบว่าเป็นเจ้าของ event หรือไม่
  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // ส่งข้อมูลที่อัปเดตแล้วกลับไป
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

  // ตรวจสอบว่าเป็นเจ้าของ event หรือไม่
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
