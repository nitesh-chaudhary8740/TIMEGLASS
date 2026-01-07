import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' }, 
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: {
        type: String,
        trim: true,
        // Validation for exactly 10 digits (Standard Indian format)
        // Adjust regex if you plan to go international
        match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number'],
        minLength: [10, 'Phone number must be at least 10 digits'],
        // Note: unique: true might be tricky if users share numbers, 
        // but generally recommended for integrity.
    },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  
  // --- AUTHENTICATION ---
  otp: { value: String, expiresAt: Date },
  isVerified: { type: Boolean, default: false },
  
  // --- CUSTOMER DATA ---
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  addresses: [addressSchema],
  
  // --- THE CART ---
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  lastLogin: { type: Date }
}, { timestamps: true });

// --- SMART MIDDLEWARE ---
userSchema.pre('save', async function() {
  if (this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter(a => a.isDefault);
    
    // 1. Error if multiple defaults
    if (defaultAddresses.length > 1) {
      throw new Error('Only one address can be set as default.');
    }
    
    // 2. Auto-set default if only one address exists
    if (defaultAddresses.length === 0) {
      this.addresses[0].isDefault = true;
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;