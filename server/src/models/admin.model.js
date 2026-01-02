const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Roles can help if you have "Super Admins" and "Support Staff"
  role: { 
    type: String, 
    enum: ['superadmin', 'manager', 'support'], 
    default: 'manager' 
  },
  
  // Tracking admin activity
  lastLogin: { type: Date },
  permissions: {
    canEditProducts: { type: Boolean, default: true },
    canDeleteUsers: { type: Boolean, default: false },
    canManageDisputes: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);