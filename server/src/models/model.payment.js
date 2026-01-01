// models/Payment.js
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount_paid: { type: Number, required: true },
    platform_commission: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    final_vendor_payout: { type: Number, default: 0 },
    payment_method: { type: String, enum: ['card', 'upi', 'cash', 'wallet'], required: true },
    transaction_id: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed', 'pending', 'refunded'], default: 'success' },
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);