// server/routes/quotationRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getQuotations, 
    createQuotation, 
    getQuotationById, 
    updateQuotationStatus,
    getQuotationByToken,
    handleApprovalAction
} = require('../controllers/quotationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// --- Public Routes ---
router.route('/approve/:token')
    .get(getQuotationByToken)
    .post(handleApprovalAction);

// --- Protected Routes ---
router.use(protect);

router.route('/')
    .get(authorize(PERMISSIONS.QUOTATIONS_MANAGE), getQuotations)
    .post(authorize(PERMISSIONS.QUOTATIONS_MANAGE), createQuotation);

router.route('/:id')
    .get(authorize(PERMISSIONS.QUOTATIONS_MANAGE), getQuotationById);

router.route('/:id/status')
    .put(authorize(PERMISSIONS.QUOTATIONS_MANAGE), updateQuotationStatus);

module.exports = router;