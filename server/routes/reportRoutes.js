// server/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { getSalesReport, getInventoryReport, getPawnReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/sales', getSalesReport);
router.get('/inventory', getInventoryReport);
router.get('/pawn', getPawnReport);

module.exports = router;