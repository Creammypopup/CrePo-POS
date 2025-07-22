import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// @desc    Fetch all events
// @route   GET /api/calendar/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  // We're fetching events for the logged-in user
  const events = await Event.find({ user: req.user._id });
  res.json(events);
});

// @desc    Create an event
// @route   POST /api/calendar/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, allDay, color } = req.body;

  if (!title || !start) {
    res.status(400);
    throw new Error('กรุณาใส่ชื่อกิจกรรมและวันเริ่มต้น');
  }

  const event = new Event({
    user: req.user._id, // Associate event with the logged-in user
    title,
    start,
    end,
    allDay,
    color,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Update an event
// @route   PUT /api/calendar/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const { title, start, end, allDay, color } = req.body;

  const event = await Event.findById(req.params.id);

  // Check if the event belongs to the user
  if (event.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('ไม่ได้รับอนุญาตให้แก้ไขกิจกรรมนี้');
  }

  if (event) {
    event.title = title || event.title;
    event.start = start || event.start;
    event.end = end || event.end;
    event.allDay = allDay === undefined ? event.allDay : allDay;
    event.color = color || event.color;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('ไม่พบกิจกรรมนี้');
  }
});

// @desc    Delete an event
// @route   DELETE /api/calendar/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  // Check if the event belongs to the user
  if (event && event.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('ไม่ได้รับอนุญาตให้ลบกิจกรรมนี้');
  }

  if (event) {
    await event.deleteOne();
    // This is the line that was fixed. Added the closing })
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('ไม่พบกิจกรรมนี้');
  }
});

export { getEvents, createEvent, updateEvent, deleteEvent };
