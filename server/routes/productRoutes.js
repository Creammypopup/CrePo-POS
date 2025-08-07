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
const { PERMISSIONS } = require('../utils/permissions');

// All product routes require login
router.use(protect);

// Routes for viewing products and finding by barcode - requires view permission
router.route('/').get(authorize(PERMISSIONS.PRODUCTS_VIEW), getProducts);
router.get('/barcode/:barcode', authorize(PERMISSIONS.POS_ACCESS), findProductByBarcode);

// Routes for managing products - requires manage permission
router.route('/').post(authorize(PERMISSIONS.PRODUCTS_MANAGE), createProduct);
router.route('/:id')
  .put(authorize(PERMISSIONS.PRODUCTS_MANAGE), updateProduct)
  .delete(authorize(PERMISSIONS.PRODUCTS_MANAGE), deleteProduct);

module.exports = router;
