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
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
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
