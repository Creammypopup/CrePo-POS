const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers, // <-- เพิ่ม import
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginUser);

// --- START OF EDIT: ปรับแก้ Routes ทั้งหมดให้ถูกต้อง ---

// Private routes (ต้อง Login)
router.use(protect);

router.get('/me', getMe);

// Admin only routes
router.use(authorize('admin'));

router.post('/register', registerUser); // แก้ Path จาก '/' เป็น '/register'
router.get('/', getUsers);               // เพิ่ม Route สำหรับดึงผู้ใช้ทั้งหมด
router.put('/:id', updateUser);          // เพิ่ม Route สำหรับอัปเดต
router.delete('/:id', deleteUser);       // เพิ่ม Route สำหรับลบ

// --- END OF EDIT ---

module.exports = router;