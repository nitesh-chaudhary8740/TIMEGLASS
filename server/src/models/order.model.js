import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // RECIPIENT DETAILS
  recipient: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    email: { type: String, required: true }
  },

  // ITEM-LEVEL TRACKING (The Core Change)
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    itemOTP: { type: String, default: null },
    itemOtpExpires: { type: Date, default: null },
    
    // Status is now tracked per product
    status: { 
      type: String, 
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return_Requested', 'Returned'], 
      default: 'Processing' 
    },
    
    // Tracking specific to this item (useful if items ship separately)
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    
    // Refund tracking for this specific item
    refundInfo: {
      isRefunded: { type: Boolean, default: false },
      refundId: { type: String }, // Razorpay Refund ID
      amountRefunded: { type: Number, default: 0 }
    }
  }],

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },

  // FINANCIALS
  itemsPrice: { type: Number, required: true, default: 0 }, 
  shippingPrice: { type: Number, required: true, default: 0 }, 
  totalAmount: { type: Number, required: true, default: 0 },

  // GLOBAL PAYMENT STATUS
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed'], 
    default: 'Pending' 
  },

  paymentInfo: {
    id: { type: String }, // razorpayPaymentId
    method: { type: String, enum: ['Prepaid', 'COD'], default: 'Prepaid' },
    razorpayOrderId: { type: String }
  },

  // Global security for delivery
  deliveryOTP: { type: String, default: null },
  otpExpires: { type: Date, default: null }

}, { timestamps: true });

// Indexing for faster history lookups
orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;