const express = require('express');
const router = express.Router();
const {
  createSale,
  getSales,
  getSaleById,
  deleteSale,
} = require('../controllers/saleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/').get(authorize(PERMISSIONS.SALES_VIEW), getSales).post(authorize(PERMISSIONS.POS_ACCESS), createSale);

router.route('/:id').get(authorize(PERMISSIONS.SALES_VIEW), getSaleById).delete(authorize(PERMISSIONS.SALES_VIEW), deleteSale); // Consider a higher permission for delete

module.exports = router;