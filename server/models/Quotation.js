// server/models/Quotation.js
const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  quotationId: { type: String, required: true, unique: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number },
  }],
  subTotal: { type: Number },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number },
  notes: { type: String },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected'], default: 'draft' },
  validUntil: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);