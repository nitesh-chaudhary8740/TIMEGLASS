const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true,trim:true},
  description: { type: String, required: true },
  tier: { 
    type: String, 
    enum: ['Standard', 'Premium', 'Limited Edition'], 
    default: 'Standard' 
  },
  isFreeShipping: { type: Boolean, default: true },
  warranty: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['Months', 'Years'], default: 'Years' }
  },
  returnDays: { type: Number, default: 7 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published'], 
    default: 'Draft' 
  },
  images: [{ type: String }], // Array of URLs
  defaultImage:{type:String},
  stock: { type: Number, default: 0 },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Product', productSchema);