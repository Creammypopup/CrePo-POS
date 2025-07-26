const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: [true, 'กรุณาระบุวันที่'],
        default: Date.now,
    },
    description: {
        type: String,
        required: [true, 'กรุณาระบุรายละเอียดค่าใช้จ่าย'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'กรุณาระบุหมวดหมู่'],
        enum: ['ค่าเดินทาง', 'ค่าวัสดุ', 'ค่าจ้าง', 'ค่าสาธารณูปโภค', 'อื่นๆ'], // หมวดหมู่ตัวอย่าง
        default: 'อื่นๆ',
    },
    amount: {
        type: Number,
        required: [true, 'กรุณาระบุจำนวนเงิน'],
    },
    vendor: { // ผู้ขาย/ร้านค้า (ไม่บังคับ)
        type: String,
        trim: true,
    },
    // สามารถเพิ่ม field สำหรับแนบไฟล์ใบเสร็จได้ในอนาคต
    // receiptImage: { type: String }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);