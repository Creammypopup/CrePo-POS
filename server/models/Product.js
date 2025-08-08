const mongoose = require('mongoose');

/**
 * Schema สำหรับเก็บข้อมูลขนาดหรือรูปแบบต่างๆ ของสินค้า (Product Variants)
 * เช่น สี 1 ลิตร, สี 5 ลิตร หรือ ท่อ PVC 1/2 นิ้ว, ท่อ PVC 3/4 นิ้ว
 */
const productSizeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // e.g., "5 ลิตร", "1/2 นิ้ว"
  sku: { type: String, unique: true, sparse: true, trim: true },
  barcode: { type: String, unique: true, sparse: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, default: 0, min: 0 }, // ต้นทุนสำหรับขนาดนี้โดยเฉพาะ
  stock: { type: Number, required: true, default: 0 },
});

/**
 * Schema หลักสำหรับเก็บข้อมูลสินค้า
 * ออกแบบมาเพื่อรองรับธุรกิจวัสดุก่อสร้างโดยเฉพาะ
 */
const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'กรุณาระบุชื่อสินค้า'],
      trim: true,
      // e.g., "สีทาภายใน TOA Supershield Duraclean A+"
    },
    description: {
      type: String,
      trim: true,
    },
    // เชื่อมโยงไปยัง Model ProductCategory
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
      required: [true, 'กรุณาระบุหมวดหมู่สินค้า'],
    },
    // หน่วยนับหลักของสินค้ากลุ่มนี้ เช่น กระป๋อง, เส้น, ถุง
    baseUnit: {
      type: String,
      required: [true, 'กรุณาระบุหน่วยนับหลัก'],
    },
    // ประเภทสินค้าเพื่อการจัดการที่แตกต่างกัน
    productType: {
      type: String,
      enum: ['standard', 'weighted', 'service'], // standard (นับชิ้น/หน่วย), weighted (ชั่งน้ำหนัก), service (ค่าบริการ)
      default: 'standard',
    },
    // เก็บรายการขนาด/รูปแบบทั้งหมดของสินค้านี้
    sizes: [productSizeSchema],
    // ผู้จำหน่ายหลัก (ไม่บังคับ)
    primarySupplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    }
  },
  { timestamps: true } // เพิ่ม field createdAt และ updatedAt อัตโนมัติ
);

// สร้าง Index เพื่อการค้นหาที่มีประสิทธิภาพ
productSchema.index({ user: 1, name: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;