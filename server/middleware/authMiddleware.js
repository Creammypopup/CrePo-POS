const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // CRITICAL FIX: Ensure the user's role is always populated.
      req.user = await User.findById(decoded.id).populate('role').select('-password');

      if (!req.user) {
          return res.status(401).json({ message: 'ไม่ได้รับอนุญาต, ไม่พบผู้ใช้งาน' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'ไม่ได้รับอนุญาต, Token ไม่ถูกต้อง' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'ไม่ได้รับอนุญาต, ไม่มี Token' });
  }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role.name)) {
            const userRole = req.user && req.user.role ? req.user.role.name : 'ไม่มีตำแหน่ง';
            return res.status(403).json({ message: `สิทธิ์ผู้ใช้ ${userRole} ไม่ได้รับอนุญาตให้เข้าถึงส่วนนี้` });
        }
        next();
    }
}

module.exports = { protect, authorize };
