// server/routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const {
  getSales,
  getSaleById,
  createSale,
  deleteSale,
} = require('../controllers/saleController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .get(getSaleById)
  .delete(deleteSale);

module.exports = router;