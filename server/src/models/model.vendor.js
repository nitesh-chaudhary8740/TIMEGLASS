// models/Vendor.js
import mongoose from 'mongoose';

const ServiceAreaSchema = new mongoose.Schema({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    radius_km: { type: Number, default: 10 }
});

const VendorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    professional_name: { type: String, required: true, trim: true },
    business_name: { type: String },
    service_subcategories: [{ // Array to allow a Vendor to specialize in multiple subcategories
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceSubcategory', 
        required: true 
    }], 
    verification_status: { type: String, enum: ['pending', 'in_review', 'verified', 'rejected'], default: 'pending' },
    documents: [{ type: String }],
    service_area: ServiceAreaSchema,
    payout_account_id: { type: String },
    average_rating: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

VendorSchema.index({ 'service_area.coordinates': '2dsphere' });

export default mongoose.model('Vendor', VendorSchema);