// server/routes/purchaseOrderRoutes.js
const express = require('express');
const router = express.Router();
const { createPurchaseOrder, getPurchaseOrders } = require('../controllers/purchaseOrderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/')
    .get(authorize(PERMISSIONS.PURCHASE_ORDERS_VIEW), getPurchaseOrders)
    .post(authorize(PERMISSIONS.PURCHASE_ORDERS_MANAGE), createPurchaseOrder);

module.exports = router;