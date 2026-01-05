import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  tier: { 
    type: String, 
    enum: ['Standard', 'Premium', 'Limited Edition'], 
    default: 'Standard' 
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  defaultImage: { 
    url: { type: String, required: true },
    public_id: { type: String, required: true }  
  }, 
  
  // --- NEW LOGISTICS FIELDS ---
  stock: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  
  shipping: {
    type: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
    cost: { type: Number, default: 0 }
  },

  warranty: {
    value: { type: Number, default: 2 },
    unit: { type: String, default: 'Years' }
  },

  returnDays: { type: Number, default: 7 },

  // --- ADDED RATING & REVIEWS ---
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  // -----------------------------

}, { timestamps: true });

// INDEXING
productSchema.index({ price: 1, tier: 1 });
productSchema.index({ rating: -1 }); // Added index for sorting by top rated
productSchema.index({ name: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;