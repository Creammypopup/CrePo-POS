// server/routes/settingRoutes.js
const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/')
  .get(authorize(PERMISSIONS.SETTINGS_MANAGE_GENERAL), getSettings)
  .put(authorize(PERMISSIONS.SETTINGS_MANAGE_GENERAL), updateSettings);

module.exports = router;