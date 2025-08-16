// server/routes/settingRoutes.js
const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// router.use(protect);

router.route('/')
  .get(getSettings)
  .put(updateSettings);

module.exports = router;