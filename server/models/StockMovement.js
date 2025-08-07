// server/models/StockMovement.js
const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  sizeId: { type: String }, // For variant products
  type: {
    type: String,
    required: true,
    enum: ['receive', 'sale', 'return', 'adjustment-add', 'adjustment-remove'],
  },
  quantity: { type: Number, required: true }, // Can be positive or negative
  cost: { type: Number }, // Cost at the time of movement
  reference: { type: mongoose.Schema.Types.ObjectId }, // Ref to Sale, PurchaseOrder, etc.
  notes: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);