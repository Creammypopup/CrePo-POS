// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  findProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProducts)
  .post(authorize('Admin', 'Manager'), createProduct);

router.get('/barcode/:barcode', findProductByBarcode); // New route for barcode scanning

router.route('/:id')
  .put(authorize('Admin', 'Manager'), updateProduct)
  .delete(authorize('Admin', 'Manager'), deleteProduct);

module.exports = router;