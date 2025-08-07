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
        sizeId: { type: String },
        sizeName: { type: String },
        quantity: { type: Number, required: true },
        priceAtSale: { type: Number, required: true },
        unitAtSale: { type: String },
        originalPrice: { type: Number },
        costAtSale: { type: Number, required: true, default: 0 },
        isFreebie: { type: Boolean, default: false },
        itemDiscountType: { type: String, enum: ['percentage', 'amount'] },
        itemDiscountValue: { type: Number, default: 0 },
      },
    ],
    subTotal: { type: Number, required: true },
    discountType: { type: String, enum: ['percentage', 'amount'] },
    discountValue: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'transfer', 'credit'], required: true },
    isDelivery: { type: Boolean, default: false },
    deliveryStatus: { type: String, enum: ['pending', 'preparing', 'shipping', 'delivered'], default: 'pending' },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;