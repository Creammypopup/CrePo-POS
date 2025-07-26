const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

// **START OF EDIT: แก้ไขการใช้ middleware ใน route**
router.route('/')
  .get(protect, getEvents)
  .post(protect, createEvent);

router.route('/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);
// **END OF EDIT**

module.exports = router;