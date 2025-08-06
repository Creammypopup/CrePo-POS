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
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    supplierName: { type: String, required: true },
    cost: { type: Number, required: true },
});

// --- START OF EDIT ---
const productSizeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String }, // Added SKU for each size
    price: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 }
});
// --- END OF EDIT ---

const weightInfoSchema = new mongoose.Schema({
    baseWeight: { type: Number, required: true },
    baseUnit: { type: String, required: true },
    sellingUnit: { type: String, required: true },
    prices: [{
        unit: String,
        price: Number
    }]
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
  stock: { type: Number, default: 0 },
  stockAlert: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  
  productType: { type: String, enum: ['standard', 'weighted', 'service', 'gift'], default: 'standard' },
  hasMultipleSizes: { type: Boolean, default: false },
  sizes: [productSizeSchema],
  hasSubUnits: { type: Boolean, default: false },
  sellingUnits: [sellingUnitSchema],
  hasMultipleSuppliers: { type: Boolean, default: false },
  suppliers: [supplierInfoSchema],
  weightInfo: weightInfoSchema,
  
}, { timestamps: true });

productSchema.pre('save', function(next) {
    if (this.isNew && !this.sku) {
        this.sku = `SKU-${skuGenerator()}`;
    }
    if (this.isNew && !this.barcode) {
        this.barcode = barcodeGenerator();
    }
    if (this.isNew && this.suppliers.length === 0 && this.cost > 0) {
        this.suppliers.push({ supplierName: 'ไม่ระบุ', cost: this.cost });
    }
    next();
});

productSchema.index({ user: 1, name: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;