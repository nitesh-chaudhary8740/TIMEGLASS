// models/ServiceCategory.js
import mongoose from 'mongoose';

const ServiceCategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, unique: true }, // e.g., "Electrician", "Men Saloon"
    description: { type: String },
    icon_url: { type: String },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('ServiceCategory', ServiceCategorySchema);