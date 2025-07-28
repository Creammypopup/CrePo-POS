    // server/routes/settingRoutes.js
    const express = require('express');
    const router = express.Router();
    const { getSettings, updateSettings } = require('../controllers/settingController');
    const { protect, authorize } = require('../middleware/authMiddleware');

    // All routes are protected
    router.use(protect);

    router.route('/')
      .get(getSettings) // Any logged-in user can view settings
      .put(authorize('Admin', 'Manager'), updateSettings); // Only Admin/Manager can update

    module.exports = router;
    