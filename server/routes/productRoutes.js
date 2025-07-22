const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// นำเข้า Middleware ที่เราสร้าง
const { protect, authorize } = require('../middleware/authMiddleware');

// ใช้ "protect" กับทุก Route ในไฟล์นี้
// หมายความว่า ทุก Action ที่เกี่ยวกับสินค้า ผู้ใช้ต้อง Login ก่อนเสมอ
router.use(protect);

// กำหนด Route และสิทธิ์การเข้าถึง
router.route('/')
  .get(getProducts) // ทุกคนที่ Login สามารถดูสินค้าทั้งหมดได้
  .post(authorize('admin', 'manager'), createProduct); // เฉพาะ admin และ manager ที่สร้างสินค้าได้

router.route('/:id')
  .get(getProductById) // ทุกคนที่ Login สามารถดูสินค้าทีละชิ้นได้
  .put(authorize('admin', 'manager'), updateProduct) // เฉพาะ admin และ manager ที่แก้ไขสินค้าได้
  .delete(authorize('admin', 'manager'), deleteProduct); // เฉพาะ admin และ manager ที่ลบสินค้าได้

module.exports = router;
