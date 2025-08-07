// server/routes/quotationRoutes.js
const express = require('express');
const router = express.Router();
const { getQuotations, createQuotation } = require('../controllers/quotationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/')
    .get(authorize(PERMISSIONS.QUOTATIONS_MANAGE), getQuotations)
    .post(authorize(PERMISSIONS.QUOTATIONS_MANAGE), createQuotation);

module.exports = router;