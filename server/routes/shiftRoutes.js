// server/routes/shiftRoutes.js
const express = require('express');
const router = express.Router();
const { getCurrentShift, openShift, closeShift } = require('../controllers/shiftController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/current', getCurrentShift);
router.post('/open', openShift);
router.post('/close', closeShift);

module.exports = router;