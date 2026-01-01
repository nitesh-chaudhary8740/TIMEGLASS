// models/User.js
import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    label: { type: String, required: true, trim: true },
    full_address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { _id: false });

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String }, 
    full_name: { type: String, trim: true }, 
    phone_number: { type: String, trim: true },
    auth_method: { type: String, enum: ['email', 'oauth'], default: 'email' },
    oauth_id: { type: String },
    is_verified: { type: Boolean, default: false },
    profile_picture_url: { type: String },
    saved_addresses: [AddressSchema],
}, { timestamps: true });

export default mongoose.model('User', UserSchema);