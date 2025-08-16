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
    // เพิ่มข้อมูลหน่วยขายที่ใช้ในการเสนอราคา
    sellingUnit: {
      name: { type: String },
      price: { type: Number },
      stockConversionFactor: { type: Number },
    },
    productType: { type: String }, // standard, weight_based, service
    stockUnit: { type: String }, // หน่วยสต็อกหลักของสินค้านั้นๆ
  }],
  subTotal: { type: Number },
  approvalToken: { type: String, unique: true, sparse: true }, // Token สำหรับลิงก์อนุมัติ
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number },
  notes: { type: String },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected'], default: 'draft' },
  validUntil: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);