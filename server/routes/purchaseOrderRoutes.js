// server/routes/purchaseOrderRoutes.js
const express = require('express');
const router = express.Router();
const { createPurchaseOrder, getPurchaseOrders } = require('../controllers/purchaseOrderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getPurchaseOrders)
    .post(authorize('Admin', 'Manager'), createPurchaseOrder);

module.exports = router;