// server/routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { adjustStock, getStockHistory } = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.post('/adjust', authorize(PERMISSIONS.INVENTORY_ADJUST_STOCK), adjustStock);
router.get('/history/:productId', authorize(PERMISSIONS.INVENTORY_VIEW), getStockHistory);

module.exports = router;