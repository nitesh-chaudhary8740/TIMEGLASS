import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentGateway: { type: String, default: 'Razorpay' }, 
  gatewayTransactionId: { type: String, required: true }, // razorpay_payment_id
  gatewayOrderId: { type: String, required: true }, // razorpay_order_id
  amount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed'], 
    default: 'Pending' 
  },
}, { timestamps: true });
const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;