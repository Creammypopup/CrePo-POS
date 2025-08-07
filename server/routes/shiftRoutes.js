// server/routes/shiftRoutes.js
const express = require('express');
const router = express.Router();
const { getCurrentShift, openShift, closeShift } = require('../controllers/shiftController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

// Anyone who can access the POS should be able to manage their shift
router.get('/current', authorize(PERMISSIONS.POS_ACCESS), getCurrentShift);
router.post('/open', authorize(PERMISSIONS.POS_ACCESS), openShift);
router.post('/close', authorize(PERMISSIONS.POS_ACCESS), closeShift);

module.exports = router;