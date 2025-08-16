// server/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// router.use(protect);

// Assuming anyone who can log in can see the dashboard stats
// If not, add a specific permission like PERMISSIONS.DASHBOARD_VIEW
router.get('/stats', getDashboardStats);

module.exports = router;