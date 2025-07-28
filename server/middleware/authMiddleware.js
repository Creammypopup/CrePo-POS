// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).populate('role').select('-password');

      if (!req.user) {
          res.status(401);
          throw new Error('ไม่ได้รับอนุญาต, ไม่พบผู้ใช้งาน');
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('ไม่ได้รับอนุญาต, Token ไม่ถูกต้อง');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('ไม่ได้รับอนุญาต, ไม่มี Token');
  }
});

const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role?.name;
        // **START OF EDIT: Convert roles to lowercase for case-insensitive check**
        const allowedRoles = roles.map(r => r.toLowerCase());
        if (!userRole || !allowedRoles.includes(userRole.toLowerCase())) {
        // **END OF EDIT**
            res.status(403);
            throw new Error(`สิทธิ์ผู้ใช้ '${userRole || 'ไม่มีตำแหน่ง'}' ไม่ได้รับอนุญาตให้เข้าถึงส่วนนี้`);
        }
        next();
    }
}

module.exports = { protect, authorize };