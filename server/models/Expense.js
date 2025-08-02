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
        // --- START OF EDIT ---
        // Removed the 'enum' property to allow any category string
        // --- END OF EDIT ---
    },
    amount: {
        type: Number,
        required: [true, 'กรุณาระบุจำนวนเงิน'],
    },
    vendor: { // ผู้ขาย/ร้านค้า (ไม่บังคับ)
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);