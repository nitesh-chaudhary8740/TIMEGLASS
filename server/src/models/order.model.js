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

  paymentInfo: {
    id: { type: String }, // Transaction ID from Razorpay/Stripe
    status: { type: String }, // 'succeeded', 'pending', 'failed'
    method: { type: String, enum: ['Prepaid', 'COD'], default: 'Prepaid' }
  },

  deliveredAt: Date,
  shippedAt: Date

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order