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
    role: { // Added role field
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true, // A user must have a role
    },
    permissions: { // Permissions will be populated from the role
      type: [String],
      default: [], // No default permissions here, derived from role
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

// Add a pre-save hook to populate permissions from the role
userSchema.pre('save', async function (next) {
  if (this.isModified('role') || this.isNew) { // Only run if role is modified or new user
    const Role = mongoose.model('Role'); // Get the Role model
    const roleDoc = await Role.findById(this.role);
    if (roleDoc) {
      this.permissions = roleDoc.permissions;
    }
  }
  next();
});

// Method: เปรียบเทียบรหัสผ่านที่ป้อนเข้ามากับรหัสผ่านใน DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;