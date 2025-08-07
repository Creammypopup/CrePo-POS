// server/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { getSalesReport, getInventoryReport, getPawnReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.get('/sales', authorize(PERMISSIONS.REPORTS_VIEW_SALES), getSalesReport);
router.get('/inventory', authorize(PERMISSIONS.REPORTS_VIEW_INVENTORY), getInventoryReport);
router.get('/pawn', authorize(PERMISSIONS.REPORTS_VIEW_PAWN), getPawnReport);

module.exports = router;