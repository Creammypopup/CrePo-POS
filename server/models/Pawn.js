// server/models/Pawn.js
const mongoose = require('mongoose');

const pawnSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    customer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customer' },
    
    // New field to distinguish between pawn and loan
    type: { type: String, enum: ['pawn', 'loan'], default: 'pawn', required: true },

    // Product fields are now optional for loans
    productName: { type: String, trim: true },
    productDescription: { type: String, trim: true },

    pawnAmount: { type: Number, required: [true, 'กรุณาระบุเงินต้น'] },
    interestRate: { type: Number, required: [true, 'กรุณาระบุอัตราดอกเบี้ย (%)'], default: 1.25 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: [true, 'กรุณาระบุวันสิ้นสุดสัญญา'] },
    status: { 
        type: String, 
        enum: ['active', 'redeemed', 'expired', 'forfeited'], 
        default: 'active' 
    },
    pawnTicketId: { type: String, unique: true }, // เลขที่ตั๋ว
    notes: { type: String, trim: true },
}, { timestamps: true });

// Auto-generate pawnTicketId before saving
pawnSchema.pre('save', async function (next) {
    if (this.isNew && !this.pawnTicketId) {
        const lastPawn = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
        const lastId = lastPawn ? parseInt(lastPawn.pawnTicketId.split('-')[1]) : 0;
        const prefix = this.type === 'loan' ? 'LOAN' : 'PAWN';
        this.pawnTicketId = `${prefix}-${(lastId + 1).toString().padStart(6, '0')}`;
    }
    // Ensure productName is set for loans for consistency
    if (this.type === 'loan' && !this.productName) {
        this.productName = `สัญญาเงินกู้`;
    }
    next();
});

module.exports = mongoose.model('Pawn', pawnSchema);