// server/routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const {
  getSales,
  getSaleById,
  createSale,
  deleteSale,
} = require('../controllers/saleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// All routes are protected
router.use(protect);

router.route('/')
  .get(authorize(PERMISSIONS.SALES_VIEW), getSales)
  .post(authorize(PERMISSIONS.POS_ACCESS), createSale);

router.route('/:id')
  .get(authorize(PERMISSIONS.SALES_VIEW), getSaleById)
  .delete(authorize(PERMISSIONS.SALES_VIEW), deleteSale); // Assuming viewing sales allows deleting

module.exports = router;
