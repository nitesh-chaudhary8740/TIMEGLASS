import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // RECIPIENT DETAILS
  recipient: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String }, // Optional: Good for delivery drivers
    email:{type: String, required: true}
  },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,   
    price: Number,  
    quantity: Number,
    image: String   // Added: Store a snapshot of the image URL too
  }],

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true } // Changed zipCode to postalCode to match your frontend
  },

  // FINANCIALS
  itemsPrice: { type: Number, required: true, default: 0 }, // Subtotal
  shippingPrice: { type: Number, required: true, default: 0 }, // The ₹150 or ₹0 fee
  totalAmount: { type: Number, required: true, default: 0 }, // itemsPrice + shippingPrice

  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },

paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed'], 
    default: 'Pending' 
  },

  paymentInfo: {
    id: { type: String }, // Maps to razorpayPaymentId
    status: { type: String }, // 'succeeded' or 'Completed'
    method: { type: String, enum: ['Prepaid', 'COD'], default: 'Prepaid' },
    razorpayOrderId: { type: String }
  },

  shippedAt: Date,
 deliveryOTP: { 
    type: String, 
    default: null // Explicitly null for old orders
  },
  otpExpires: { 
    type: Date, 
    default: null 
  },
  deliveredAt: { 
    type: Date 
  }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order