// server/models/PurchaseOrder.js
const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  cost: { type: Number, required: true },
  expiryDate: { type: Date },
});

const purchaseOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  items: [purchaseOrderItemSchema],
  totalCost: { type: Number, required: true },
  notes: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'received'], default: 'received' },
  orderDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);