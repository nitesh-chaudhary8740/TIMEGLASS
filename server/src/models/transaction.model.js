const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentGateway: { type: String, default: 'Stripe' }, // or Razorpay/PayPal
  gatewayTransactionId: { type: String, required: true }, 
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'], 
    default: 'Pending' 
  },
  paymentMethod: String, // e.g., "Credit Card", "UPI"
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);