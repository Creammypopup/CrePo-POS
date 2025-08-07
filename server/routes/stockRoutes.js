// server/routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { adjustStock, getStockHistory } = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('Admin', 'Manager'));

router.post('/adjust', adjustStock);
router.get('/history/:productId', getStockHistory);

module.exports = router;