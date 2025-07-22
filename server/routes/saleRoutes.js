// D:\CrePo-POS\server\routes\saleRoutes.js

const express = require('express');
const router = express.Router();
const {
  getSales,
  getSaleById,
  createSale,
  deleteSale,
} = require('../controllers/saleController');

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .get(getSaleById)
  .delete(deleteSale);

module.exports = router;
