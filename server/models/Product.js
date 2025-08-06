// server/models/Product.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

// Generators for unique IDs if not provided
const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const barcodeGenerator = customAlphabet('1234567890', 13);

// Schema for products with multiple selling units (e.g., box, pack)
const sellingUnitSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "แพ็ค"
    conversionRate: { type: Number, required: true }, // e.g., 1 แพ็ค = 12 ชิ้น)
    price: { type: Number, required: true }, // Price for this unit
});

// Schema for products with different sizes/variants (e.g., S, M, L)
const productSizeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "S", "M", "L"
    sku: { type: String, uppercase: true }, // SKU for this specific size
    price: { type: Number, required: true, default: 0 },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    expiryDate: { type: Date }, // <-- ADD THIS LINE
});

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: [true, 'กรุณาใส่ชื่อสินค้า'], trim: true },
  sku: { type: String, unique: true, uppercase: true },
  barcode: { type: String, unique: true },
  description: { type: String, trim: true },
  image: { type: String, default: '/images/placeholder.png' },
  category: { type: String, required: [true, 'กรุณาระบุหมวดหมู่'] },
  mainUnit: { type: String, required: [true, 'กรุณาระบุหน่วยนับหลัก'], default: 'ชิ้น' },
  
  // Fields for standard (single-variant) products
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  stockAlert: { type: Number, default: 0 },
  expiryDate: { type: Date }, 
  
  // Flags and schemas for advanced product types
  productType: { type: String, enum: ['standard', 'weighted', 'service', 'gift'], default: 'standard' },
  hasMultipleSizes: { type: Boolean, default: false },
  sizes: [productSizeSchema], // Array of sizes/variants
  
  hasSubUnits: { type: Boolean, default: false },
  sellingUnits: [sellingUnitSchema], // Array of selling units

}, { timestamps: true });

// Middleware to auto-generate SKU/Barcode if not provided
productSchema.pre('save', function(next) {
    if (this.isNew && !this.sku) {
        this.sku = `SKU-${skuGenerator()}`;
    }
    if (this.isNew && !this.barcode) {
        this.barcode = barcodeGenerator();
    }
    next();
});

// Ensure product names are unique per user
productSchema.index({ user: 1, name: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;