// server/models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: [true, 'กรุณาใส่ชื่อลูกค้า'], trim: true },
  taxId: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { 
    type: String, 
    trim: true,
    unique: true,
    sparse: true // Allows multiple documents to have no email value
  },
  address: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

// --- START OF EDIT: Convert empty string to null to work with sparse index ---
customerSchema.pre('save', function (next) {
  if (this.email === '') {
    this.email = null;
  }
  next();
});
// --- END OF EDIT ---

customerSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Customer', customerSchema);