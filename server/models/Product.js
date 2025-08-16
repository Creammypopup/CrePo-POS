const mongoose = require('mongoose');

// โครงสร้างสำหรับหน่วยขายแต่ละหน่วย
const sellingUnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณาใส่ชื่อหน่วยขาย (เช่น ลัง, กิโลกรัม, ขีด)'],
  },
  price: {
    type: Number,
    required: [true, 'กรุณาใส่ราคาขายสำหรับหน่วยนี้'],
    min: 0,
  },
  // ตัวคูณสำหรับแปลงหน่วยขายนี้กลับไปเป็นหน่วยสต็อกหลัก
  // เช่น หน่วยสต็อกคือ kg, หน่วยขายคือ 'ขีด' >> stockConversionFactor คือ 0.1
  // เช่น หน่วยสต็อกคือ kg, หน่วยขายคือ 'ลัง (18kg)' >> stockConversionFactor คือ 18
  stockConversionFactor: {
    type: Number,
    required: [true, 'กรุณาใส่ตัวคูณแปลงค่ากลับเป็นหน่วยสต็อก'],
    min: 0,
  },
}, { _id: false });

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
        'standard',     // สินค้ามาตรฐาน นับสต็อกเป็นชิ้น
        'weight_based', // สินค้าตามน้ำหนัก สต็อกเป็นหน่วยน้ำหนัก (kg, g)
        'service',      // สินค้าบริการ ไม่ตัดสต็อก
      ],
      default: 'standard',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    // --- ส่วนจัดการสต็อกแบบใหม่ ---
    stockUnit: {
      type: String, // หน่วยของสต็อกหลัก เช่น 'kg', 'g', 'piece', 'meter'
      required: function() { return this.productType !== 'service'; },
    },
    stockQuantity: {
      type: Number, // จำนวนสต็อกในหน่วยหลัก
      default: 0,
    },
    costPerStockUnit: {
      type: Number, // ต้นทุนต่อหน่วยสต็อกหลัก
      default: 0,
    },
    reorderPoint: {
      type: Number, // จุดสั่งซื้อ (ในหน่วยสต็อกหลัก)
      default: 0,
    },
    // --- หน่วยสำหรับขาย ---
    sellingUnits: [sellingUnitSchema],

    sku: { type: String, unique: true, sparse: true },
    barcode: { type: String, unique: true, sparse: true },
    image: {
      type: String,
      default: '/images/placeholder.png',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validation เพื่อให้แน่ใจว่าถ้าเป็นสินค้า standard ต้องมีอย่างน้อย 1 หน่วยขาย
productSchema.path('sellingUnits').validate(function(value) {
  if (this.productType === 'standard' || this.productType === 'weight_based') {
    return value.length > 0;
  }
  return true;
}, 'สินค้าต้องมีอย่างน้อย 1 หน่วยสำหรับขาย');

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
