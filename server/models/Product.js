// server/models/Product.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const barcodeGenerator = customAlphabet('1234567890', 13);

const sellingUnitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    conversionRate: { type: Number, required: true },
    price: { type: Number, required: true },
});

const supplierInfoSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, // Will be used later
    supplierName: { type: String },
    cost: { type: Number, required: true },
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
  stock: { type: Number, required: true, default: 0 },
  stockAlert: { type: Number, default: 0 },
  price: { type: Number, required: [true, 'กรุณาระบุราคาขาย'], default: 0 }, // Main selling price
  cost: { type: Number, required: [true, 'กรุณาระบุราคาทุน'], default: 0 }, // Cost price
  suppliers: [supplierInfoSchema],
  sellingUnits: [sellingUnitSchema],
  productType: { type: String, enum: ['standard', 'weighted', 'gift'], default: 'standard' }
}, { timestamps: true });

productSchema.pre('save', function(next) {
    if (this.isNew && !this.sku) {
        this.sku = `SKU-${skuGenerator()}`;
    }
    if (this.isNew && !this.barcode) {
        this.barcode = barcodeGenerator();
    }
    next();
});

productSchema.index({ user: 1, name: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;