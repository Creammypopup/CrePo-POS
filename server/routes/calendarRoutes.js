const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

// --- กำหนดเส้นทาง API สำหรับจัดการกิจกรรม ---

// GET /api/calendar/ -> ดึงกิจกรรมทั้งหมดของผู้ใช้ที่ล็อกอินอยู่
router.get('/', protect, getEvents);

// POST /api/calendar/ -> สร้างกิจกรรมใหม่
router.post('/', protect, createEvent);

// PUT /api/calendar/:id -> แก้ไขกิจกรรมตาม ID
router.put('/:id', protect, updateEvent);

// DELETE /api/calendar/:id -> ลบกิจกรรมตาม ID
router.delete('/:id', protect, deleteEvent);

module.exports = router;
