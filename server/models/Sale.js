// server/models/Sale.js
const mongoose = require('mongoose');

const saleSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    shift: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Shift' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtSale: { type: Number, required: true }
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'transfer', 'credit'], required: true },
    
    // Delivery Fields
    isDelivery: { type: Boolean, default: false },
    deliveryFee: { type: Number, default: 0 },
    deliveryAddress: { type: String, trim: true },
    recipientName: { type: String, trim: true },
    recipientPhone: { type: String, trim: true },
    deliveryStatus: { type: String, enum: ['pending', 'preparing', 'shipping', 'delivered'], default: 'pending' },

  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;