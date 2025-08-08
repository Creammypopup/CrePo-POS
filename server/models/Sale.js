const mongoose = require('mongoose');

const saleProductSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sizeId: { type: mongoose.Schema.Types.ObjectId }, // For products with variants/sizes
    name: { type: String, required: true }, // Denormalized for easier reporting
    quantity: { type: Number, required: true },
    priceAtSale: { type: Number, required: true },
    costAtSale: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    products: [saleProductSchema],
    subTotal: { type: Number, required: true },
    discountType: { type: String, enum: ['amount', 'percentage'] },
    discountValue: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: ['cash', 'transfer', 'credit', 'qr', 'mixed'] },
    status: { type: String, default: 'completed', enum: ['completed', 'voided', 'pending'] },
  },
  { timestamps: true }
);

saleSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Sale', saleSchema);