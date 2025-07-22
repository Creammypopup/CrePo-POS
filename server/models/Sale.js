// D:\CrePo-POS\server\models\Sale.js

const mongoose = require('mongoose');

const saleSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer', // อ้างอิงถึงโมเดล Customer
      required: false, // การขายอาจไม่มีลูกค้าเสมอไป (เช่น ขายปลีก)
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // อ้างอิงถึงโมเดล Product
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // จำนวนสินค้าต้องมีอย่างน้อย 1 ชิ้น
        },
        priceAtSale: { // ราคา ณ เวลาที่ขาย (ป้องกันราคาเปลี่ยนในอนาคต)
          type: Number,
          required: true,
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    saleDate: {
      type: Date,
      default: Date.now, // วันที่ขายเริ่มต้นเป็นวันที่ปัจจุบัน
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
