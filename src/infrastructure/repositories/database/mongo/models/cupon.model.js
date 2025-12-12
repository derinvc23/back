const mongoose = require('mongoose');

const cuponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, required: true, enum: ['percentage', 'fixed'] },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0, min: 0 },
    maxUses: { type: Number, default: null },  // null = ilimitado
    currentUses: { type: Number, default: 0 },
    expirationDate: { type: Date, default: null },  // null = no expira
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Cupon', cuponSchema);
