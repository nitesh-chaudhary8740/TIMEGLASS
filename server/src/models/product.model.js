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

  // --- NEW FILTERABLE FIELDS ---
  gender: { 
    type: String, 
    required: true, 
    enum: ['Men', 'Women', 'Unisex', 'Kids'] 
  },
  
  movement: { 
    type: String, 
    required: true, 
    enum: ['Analog', 'Digital', 'Hybrid', 'Automatic', 'Quartz'] 
  },

  material: { 
    type: String, 
    required: true, 
    enum: ['Stainless Steel', 'Leather', 'Silicone', 'Titanium', 'Gold', 'Ceramic'] 
  },

  color: { 
    type: String, 
    required: true 
    // Usually standard strings like 'Black', 'Silver', 'Rose Gold'
  },

  caseSize: { 
    type: Number, // e.g., 42 (measured in mm)
    required: true 
  },

  waterResistance: { 
    type: String, 
    default: '30m' // Common for watches: 30m, 50m, 100m
  },

  // --- LOGISTICS & MEDIA ---
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
  
  stock: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  totalSales: {
  type: Number,
  default: 0
},
  shipping: {
    type: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
    cost: { type: Number, default: 0 }
  },

  warranty: {
    value: { type: Number, default: 2 },
    unit: { type: String, default: 'Years' }
  },

  returnDays: { type: Number, default: 7 },

  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],

}, { timestamps: true });

// --- UPDATED INDEXING FOR PERFORMANCE ---
productSchema.index({ price: 1, gender: 1, movement: 1 }); // Fast filtering
productSchema.index({ material: 1, color: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ name: 'text', description: 'text' }); // Search bar

const Product = mongoose.model('Product', productSchema);
export default Product;