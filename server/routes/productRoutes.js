const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');


// ป้องกันทุก Route ในไฟล์นี้ด้วยการตรวจสอบการล็อกอิน
router.use(protect);

router.route('/')
  .get(authorize(PERMISSIONS.PRODUCTS_VIEW), getProducts)
  .post(authorize(PERMISSIONS.PRODUCTS_MANAGE), createProduct);

router.route('/:id')
  .get(authorize(PERMISSIONS.PRODUCTS_VIEW), getProductById)
  .put(authorize(PERMISSIONS.PRODUCTS_MANAGE), updateProduct)
  .delete(authorize(PERMISSIONS.PRODUCTS_MANAGE), deleteProduct);

module.exports = router;