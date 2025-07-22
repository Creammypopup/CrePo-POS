const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณาใส่ชื่อตำแหน่ง'],
    unique: true,
    trim: true,
  },
  permissions: {
    type: [String], // เก็บรายการสิทธิ์ในรูปแบบ Array ของ String
    required: true,
    // ตัวอย่างรายการสิทธิ์ที่เป็นไปได้
    // default: ['pos-access', 'products-view']
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Role', roleSchema);
