const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,   // Snapshot of name at time of purchase
    price: Number,  // Snapshot of price at time of purchase
    quantity: Number
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  totalAmount: { type: Number, required: true },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);