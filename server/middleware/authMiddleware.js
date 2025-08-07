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

      // Populate role to get access to permissions
      req.user = await User.findById(decoded.id).populate('role').select('-password');

      if (!req.user) {
          res.status(401);
          throw new Error('ไม่ได้รับอนุญาต, ไม่พบผู้ใช้งาน');
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('ไม่ได้รับอนุญาต, Token ไม่ถูกต้อง');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('ไม่ได้รับอนุญาต, ไม่มี Token');
  }
});

// New authorize middleware that checks for specific permissions
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.role?.permissions;

    if (!userPermissions) {
        res.status(403); // Forbidden
        throw new Error('ผู้ใช้งานไม่มีตำแหน่งหรือสิทธิ์ที่ถูกกำหนด');
    }

    // Check if the user has ALL of the required permissions
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (hasRequiredPermissions) {
      next(); // User has the required permissions, proceed to the route
    } else {
      res.status(403); // Forbidden
      throw new Error('ไม่มีสิทธิ์ในการเข้าถึงส่วนนี้');
    }
  };
};

module.exports = { protect, authorize };
