// server/models/Product.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

// --- Custom Generators for SKU and Barcode ---
// For SKU: Alphanumeric, 8 characters long. e.g., "A1B2C3D4"
const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
// For Barcode: Numeric, 13 characters long (EAN-13 standard)
const barcodeGenerator = customAlphabet('1234567890', 13);


const subUnitSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'แพ็ค', 'โหล'
    conversionRate: { type: Number, required: true }, // How many main units make this sub-unit. e.g., 12 (for a dozen)
});

const supplierInfoSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, // We will create Supplier model later
    supplierName: { type: String, required: true },
    cost: { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'กรุณาใส่ชื่อสินค้า'],
    trim: true,
  },
  sku: { // Stock Keeping Unit
    type: String,
    unique: true,
    uppercase: true,
    default: () => `SKU-${skuGenerator()}`,
  },
  barcode: {
    type: String,
    unique: true,
    default: () => barcodeGenerator(),
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: '/images/placeholder.png'
  },
  category: {
    type: String,
    required: [true, 'กรุณาระบุหมวดหมู่'],
  },
  mainUnit: { // หน่วยนับหลักที่เล็กที่สุด (ที่ใช้ตัดสต็อก)
    type: String,
    required: [true, 'กรุณาระบุหน่วยนับหลัก'],
    default: 'ชิ้น'
  },
  subUnits: [subUnitSchema], // หน่วยนับย่อย
  stock: { // จำนวนคงเหลือในหน่วยนับหลัก
    type: Number,
    required: true,
    default: 0,
  },
  stockAlert: { // แจ้งเตือนเมื่อสต็อกต่ำกว่า...
    type: Number,
    default: 0,
  },
  cost: { // ต้นทุนเฉลี่ย (อาจคำนวณจากหลาย supplier)
    type: Number,
    required: true,
    default: 0,
  },
  price: { // ราคาขาย
    type: Number,
    required: true,
    default: 0,
  },
  suppliers: [supplierInfoSchema], // ผู้จำหน่าย
  isFreebie: { // เป็นของแถมหรือไม่
      type: Boolean,
      default: false
  },
  canBeSold: { // ของแถมที่สามารถขายแยกได้
      type: Boolean,
      default: true
  },
  productType: {
    type: String,
    enum: ['standard', 'weighted'], // สินค้าทั่วไป, สินค้าชั่งน้ำหนัก
    default: 'standard'
  }
}, { timestamps: true });

// Middleware to ensure SKU and Barcode are generated if not provided
productSchema.pre('save', function(next) {
    if (this.isNew && !this.isModified('sku')) {
        this.sku = `SKU-${skuGenerator()}`;
    }
    if (this.isNew && !this.isModified('barcode')) {
        this.barcode = barcodeGenerator();
    }
    next();
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;