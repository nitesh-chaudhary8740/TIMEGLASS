// models/Return.js
import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  reason: { 
    type: String, 
    required: true,
    enum: ['Defective', 'Wrong Item', 'Size/Fit Issue', 'Changed Mind', 'Quality not as expected']
  },
  description: String,
  images: [String], // URL to evidence photos
 

  // ADD THESE FIELDS HERE
  returnOTP: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  },

  
  returnStatus: {
    type: String,
    enum: ['Pending_Approval', 'Pickup_Scheduled', 'In_Transit', 'Inspected', 'Refund_Initiated', 'Completed', 'Rejected'],
    default: 'Pending_Approval'
  },

  refundDetails: {
    refundId: String, // From Razorpay
    amount: Number,
    refundedAt: Date
  }
}, { timestamps: true });

const Return = mongoose.model('Return', returnSchema);
export default Return