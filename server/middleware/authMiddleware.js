const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler.js');
const User = require('../models/User.js'); // เราจะสร้าง User Model ในขั้นตอนถัดไป
const { PERMISSIONS } = require('../utils/permissions.js');

/**
 * Middleware: Protect
 * ตรวจสอบว่าผู้ใช้ได้ล็อกอินเข้ามาในระบบหรือไม่ โดยการตรวจสอบ JWT token จาก cookie
 * หากถูกต้อง จะดึงข้อมูลผู้ใช้มาแนบกับ request (req.user)
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('ไม่ได้รับอนุญาต, token ไม่ถูกต้อง');
    }
  } else {
    res.status(401);
    throw new Error('ไม่ได้รับอนุญาต, กรุณาล็อกอิน');
  }
});

/**
 * Middleware: Authorize
 * ตรวจสอบว่าผู้ใช้ที่ล็อกอินเข้ามามีสิทธิ์ (permission) เพียงพอที่จะเข้าถึงข้อมูลหรือไม่
 * @param {...string} permissions - รายการสิทธิ์ที่ต้องการ
 */
const authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      res.status(403); // Forbidden
      throw new Error('ผู้ใช้ไม่มีสิทธิ์ที่กำหนดไว้');
    }

    const userPermissions = req.user.permissions;
    const hasPermission = permissions.some((p) => userPermissions.includes(p));

    if (hasPermission || userPermissions.includes(PERMISSIONS.ADMIN)) {
      next();
    } else {
      res.status(403);
      throw new Error('ไม่มีสิทธิ์ในการเข้าถึงส่วนนี้');
    }
  };
};

module.exports = { protect, authorize };