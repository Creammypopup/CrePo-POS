// server/models/Product.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const barcodeGenerator = customAlphabet('1234567890', 13);

const sellingUnitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    conversionRate: { type: Number, required: true }, // How many of the main unit make up this unit
    price: { type: Number, required: true },
});

const supplierInfoSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    supplierName: { type: String, required: true },
    cost: { type: Number, required: true },
});

const productSizeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'S', 'M', 'L', '1 นิ้ว'
    price: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 }
});

const weightInfoSchema = new mongoose.Schema({
    baseWeight: { type: Number, required: true }, // e.g., 18
    baseUnit: { type: String, required: true }, // e.g., 'กิโลกรัม'
    sellingUnit: { type: String, required: true }, // e.g., 'ลัง'
    prices: [{
        unit: String, // e.g., 'กิโลกรัม', 'ขีด'
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
  // --- START OF EDIT ---
  price: { type: Number, default: 0 }, // ไม่ required แล้ว
  cost: { type: Number, default: 0 },  // ไม่ required แล้ว
  // --- END OF EDIT ---
  
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
    // Set default supplier if none is provided but cost is
    if (this.isNew && this.suppliers.length === 0 && this.cost > 0) {
        this.suppliers.push({ supplierName: 'ไม่ระบุ', cost: this.cost });
    }
    next();
});

productSchema.index({ user: 1, name: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;