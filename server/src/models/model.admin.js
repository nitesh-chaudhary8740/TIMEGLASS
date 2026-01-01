import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'SUPER_ADMIN' },
  
  // ES6 Default parameters logic in the schema
  permissions: {
    type: Map,
    of: Boolean,
    default: {
      manageVendors: true,
      managePayments: true,
      editCatalog: true
    }
  }
}, { 
  timestamps: true,
  // ES6 getter/setter logic can be added here
  toJSON: { virtuals: true } 
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;