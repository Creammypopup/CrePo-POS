const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProducts)
  .post(authorize('Admin', 'Manager'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(authorize('Admin', 'Manager'), updateProduct)
  .delete(authorize('Admin', 'Manager'), deleteProduct);

module.exports = router;