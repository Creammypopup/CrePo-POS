// server/models/Product.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

const sellingUnitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    conversionRate: { type: Number, required: true },
    price: { type: Number, required: true },
});

const productSizeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, uppercase: true },
    price: { type: Number, required: true, default: 0 },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: [true, 'กรุณาใส่ชื่อสินค้า'], trim: true },
  sku: { type: String, unique: true, uppercase: true, sparse: true },
  barcode: { type: String, unique: true, sparse: true },
  category: { type: String, required: [true, 'กรุณาระบุหมวดหมู่'] },
  mainUnit: { type: String, required: true, default: 'ชิ้น' },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  stockAlert: { type: Number, default: 0 },
  allowNegativeStock: { type: Boolean, default: true }, // Default to true
  
  productType: { type: String, enum: ['standard', 'weighted', 'service', 'gift'], default: 'standard' },
  pricePerKg: { type: Number, default: 0 },

  hasMultipleSizes: { type: Boolean, default: false },
  sizes: [productSizeSchema],
  
  hasSubUnits: { type: Boolean, default: false },
  sellingUnits: [sellingUnitSchema],

  linkedFreebies: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
  }],

}, { timestamps: true });

productSchema.pre('save', function(next) {
    if (this.isNew && !this.sku) {
        this.sku = `SKU-${skuGenerator()}`;
    }
    next();
});

productSchema.index({ user: 1, name: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;