// server/routes/shiftRoutes.js
const express = require('express');
const router = express.Router();
const { getCurrentShift, openShift, closeShift } = require('../controllers/shiftController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// router.use(protect);

// Anyone who can access the POS should be able to manage their shift
router.get('/current', getCurrentShift);
router.post('/open', openShift);
router.post('/close', closeShift);

module.exports = router;