const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    // เพิ่ม username สำหรับการ login โดยเฉพาะ
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
    },
    // ลบ email field ออก
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Role',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)