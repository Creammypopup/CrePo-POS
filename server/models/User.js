const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { PERMISSIONS } = require('../utils/permissions');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'กรุณาใส่ชื่อผู้ใช้งาน'],
    },
    username: {
      type: String,
      required: [true, 'กรุณาใส่ชื่อผู้ใช้'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'กรุณาใส่รหัสผ่าน'],
      minlength: 6,
    },
    permissions: {
      type: [String],
      // กำหนดสิทธิ์เริ่มต้นสำหรับผู้ใช้ใหม่
      default: [
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.CATEGORIES_VIEW,
        PERMISSIONS.SUPPLIERS_VIEW,
      ],
    },
  },
  { timestamps: true }
);

// Middleware: เข้ารหัสรหัสผ่านก่อนบันทึก
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method: เปรียบเทียบรหัสผ่านที่ป้อนเข้ามากับรหัสผ่านใน DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;