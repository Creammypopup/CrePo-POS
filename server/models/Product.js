// server/models/Product.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const barcodeGenerator = customAlphabet('1234567890', 13);

// --- START OF EDIT: Renamed subUnitSchema to sellingUnitSchema for clarity ---
const sellingUnitSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'ขีด', 'กิโลกรัม', 'ลัง'
    conversionRate: { type: Number, required: true }, // How many main units make this unit. (Main unit = 1)
    price: { type: Number, required: true }, // Price for this specific unit
});
// --- END OF EDIT ---

const supplierInfoSchema = new mongoose.Schema({
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
  price: { type: Number, required: true, default: 0 }, // Main selling price
  suppliers: [supplierInfoSchema],
  sellingUnits: [sellingUnitSchema], // <-- EDIT: Changed from subUnits
  productType: { type: String, enum: ['standard', 'weighted'], default: 'standard' }
}, { timestamps: true });

productSchema.pre('save', function(next) {
    if (this.isNew && !this.sku) {
        this.sku = `SKU-${skuGenerator()}`;
    }
    if (this.isNew && !this.barcode) {
        this.barcode = barcodeGenerator();
    }
    // Set the main price from the base selling unit if not set
    if (this.sellingUnits && this.sellingUnits.length > 0) {
        const baseUnit = this.sellingUnits.find(u => u.conversionRate === 1);
        if (baseUnit) {
            this.price = baseUnit.price;
        }
    }
    next();
});

productSchema.index({ user: 1, name: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;