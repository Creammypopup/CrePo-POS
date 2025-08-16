const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');
const { PERMISSIONS } = require('../utils/permissions.js');

// ใช้ `protect` เพื่อให้แน่ใจว่าผู้ใช้ต้องล็อกอินก่อนเข้าถึง API ทุกเส้นทางในไฟล์นี้
// router.use(protect);

router
  .route('/')
  .get(getProducts) // เฉพาะผู้มีสิทธิ์ดูสินค้า
  .post(createProduct); // เฉพาะผู้มีสิทธิ์จัดการสินค้า

router
  .route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;