const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "4 หุน", "6 หุน", "สีแดง"
  sku: { type: String, required: true, unique: true }, // Stock Keeping Unit for this specific variant
  barcode: { type: String, unique: true, sparse: true },
  costPrice: { type: Number, required: true, default: 0 }, // ต้นทุน
  sellingPrice: { type: Number, required: true, default: 0 }, // ราคาขาย
  quantity: { type: Number, required: true, default: 0 }, // จำนวนในสต็อก
  reorderPoint: { type: Number, default: 0 }, // จุดสั่งซื้อ
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'กรุณาใส่ชื่อสินค้า'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    productType: {
      type: String,
      required: true,
      enum: [
        'standard', // สินค้าทั่วไป (นับเป็นชิ้น)
        'by_unit',  // สินค้าแบ่งขาย (เช่น ทรายเป็นคิว)
        'by_weight',// สินค้าชั่งน้ำหนัก (เช่น ตะปูเป็นกิโล)
        'service',  // สินค้าบริการ (ไม่ตัดสต็อก เช่น ค่าจัดส่ง)
        'gift',     // สินค้าของแถม
      ],
      default: 'standard',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // เราจะต้องสร้าง Category model ในอนาคต
      // required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier', // เราจะต้องสร้าง Supplier model ในอนาคต
    },
    trackStock: {
      type: Boolean,
      default: true, // true = จัดการสต็อก, false = สินค้า non-stock
    },
    // สำหรับสินค้าที่ไม่มีหลายขนาด/รูปแบบ (Simple Product)
    sku: { type: String, unique: true, sparse: true },
    barcode: { type: String, unique: true, sparse: true },
    costPrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    reorderPoint: { type: Number, default: 0 },

    // สำหรับสินค้าที่มีหลายขนาด/รูปแบบ (Variable Product)
    variants: [variantSchema],

    // รูปภาพสินค้า
    image: {
      type: String,
      default: '/images/placeholder.png',
    },
    
    isActive: {
      type: Boolean,
      default: true, // ใช้สำหรับซ่อนสินค้าโดยไม่ต้องลบ
    },
  },
  {
    timestamps: true, // เพิ่ม createdAt และ updatedAt อัตโนมัติ
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;