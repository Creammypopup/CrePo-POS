const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token มีอายุ 30 วัน
  });

  // ตั้งค่า JWT เป็น HTTP-Only cookie เพื่อความปลอดภัยสูงสุด
  // ป้องกันการเข้าถึงจาก JavaScript ฝั่ง Client (XSS attacks)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // ใช้ secure cookies ใน production (HTTPS)
    sameSite: 'strict', // ป้องกัน CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 วัน
  });
};

module.exports = generateToken;