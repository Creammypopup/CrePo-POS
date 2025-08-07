// server/models/Customer.js
const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sizeId: { type: String },
    lastPrice: { type: Number }
});

const customerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: [true, 'กรุณาใส่ชื่อลูกค้า'], trim: true },
  taxId: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { 
    type: String, 
    trim: true,
    unique: true,
    sparse: true
  },
  address: { type: String, trim: true },
  notes: { type: String, trim: true },
  priceHistory: [priceHistorySchema] // <-- ADD THIS LINE
}, { timestamps: true });

customerSchema.pre('save', function (next) {
  if (this.email === '') {
    this.email = null;
  }
  next();
});

customerSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Customer', customerSchema);