import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  // Changed 'name' to 'username' to match your seed script
  username: { 
    type: String, 
    required: [true, "Username is required"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true, // Auto-converts to lowercase
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: 6 
  },
  
  // Updated enum to match your 'SUPER_ADMIN' usage in the seed script
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'MANAGER', 'SUPPORT'], 
    default: 'MANAGER' 
  },
  
  lastLogin: { type: Date },
  
  // Fine-grained control for the TIMEGLASS dashboard
  permissions: {
    canEditProducts: { type: Boolean, default: true },
    canDeleteUsers: { type: Boolean, default: false },
    canManageDisputes: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Indexing email for faster login lookups
adminSchema.index({ email: 1 });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;