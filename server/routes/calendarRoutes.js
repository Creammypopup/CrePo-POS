// server/routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  deleteEvent,
} = require('../controllers/calendarController'); // ตรวจสอบให้แน่ใจว่า controller มีฟังก์ชันครบ
const { protect } = require('../middleware/authMiddleware');

// ใช้ middleware `protect` กับทุก route ในไฟล์นี้
router.use(protect);

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  // .put(updateEvent) // เรายังไม่มีฟังก์ชัน update ใน controller จึงคอมเมนต์ออกไปก่อน
  .delete(deleteEvent);

module.exports = router;