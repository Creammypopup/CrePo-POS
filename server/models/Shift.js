// server/models/Shift.js
const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    startAmount: { type: Number, required: true }, // เงินทอนเริ่มต้น
    endAmount: { type: Number }, // เงินสดในลิ้นชักตอนปิด
    
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },

    // สรุปยอดตอนปิดกะ
    totalSales: { type: Number, default: 0 }, // ยอดขายรวม (เงินสด + โอน + เครดิต)
    cashSales: { type: Number, default: 0 }, // ยอดขายเงินสด
    transferSales: { type: Number, default: 0 }, // ยอดขายโอน
    creditSales: { type: Number, default: 0 }, // ยอดขายเงินเชื่อ
    
    cashInDrawer: { type: Number }, // เงินสดที่ควรจะมีในลิ้นชัก (startAmount + cashSales)
    cashDifference: { type: Number }, // ส่วนต่าง (endAmount - cashInDrawer)

    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    shiftNumber: { type: Number, required: true },
}, { timestamps: true });

// Auto-generate shiftNumber before saving
shiftSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastShift = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
        this.shiftNumber = lastShift ? lastShift.shiftNumber + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('Shift', shiftSchema);