// server/models/Supplier.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: [true, 'กรุณาใส่ชื่อผู้จำหน่าย'], trim: true },
  contactPerson: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true },
  address: { type: String, trim: true },
  taxId: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

supplierSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Supplier', supplierSchema);