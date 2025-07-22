const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

// Protect all calendar routes
router.use(protect);

router.route('/')
  .get(getEvents)
  .post(createEvent);

module.exports = router;