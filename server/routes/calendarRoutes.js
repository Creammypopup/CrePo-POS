const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/calendar/ -> ดึงกิจกรรมทั้งหมด
router.get('/', protect, getEvents);

// POST /api/calendar/ -> สร้างกิจกรรมใหม่
router.post('/', protect, createEvent);

// PUT /api/calendar/:id -> แก้ไขกิจกรรม
router.put('/:id', protect, updateEvent);

// DELETE /api/calendar/:id -> ลบกิจกรรม
router.delete('/:id', protect, deleteEvent);

module.exports = router;
