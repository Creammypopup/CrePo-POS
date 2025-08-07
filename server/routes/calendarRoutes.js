// server/routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  deleteEvent,
} = require('../controllers/calendarController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

// Assuming anyone who can log in can view/manage the calendar.
// If not, add a specific permission like PERMISSIONS.CALENDAR_VIEW
router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .delete(deleteEvent);

module.exports = router;