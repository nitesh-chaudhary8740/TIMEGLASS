// models/ServiceSubcategory.js
import mongoose from 'mongoose';

const ServiceSubcategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "Fan", "Massage"
    parent_category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceCategory', 
        required: true 
    },
    description: { type: String },
    icon_url: { type: String },
}, { timestamps: true });

export default mongoose.model('ServiceSubcategory', ServiceSubcategorySchema);