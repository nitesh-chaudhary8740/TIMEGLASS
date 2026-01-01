

import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    // (Existing Options Schema remains here)
    name: { type: String, required: true },
    is_mandatory: { type: Boolean, default: false },
    type: { type: String, enum: ['select', 'number', 'boolean'], default: 'select' },
    choices: [{
        label: { type: String },
        price_modifier: { type: Number, default: 0 },
    }],
}, { _id: false });

const ServiceDetailSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    details: { type: String, required: true },
    display_type: { type: String, enum: ['inclusions', 'exclusions', 'process', 'requirements'], default: 'inclusions' }
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true, unique: true }, 
    subcategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceSubcategory', 
        required: true 
    }, 
    base_price: { type: Number, required: true },
    estimated_duration_hours: { type: Number, required: true },

    // ⚡ NEW DYNAMIC CONTENT FIELDS ⚡
    service_images: [{ 
        type: String 
    }], // Array of image URLs for the detail page
    service_details: [ServiceDetailSchema], // Array for dynamic headings/descriptions (Req: Dynamic Content)
    
    service_options: [OptionSchema], // Booking options
}, { timestamps: true });

export default mongoose.model('Service', ServiceSchema);