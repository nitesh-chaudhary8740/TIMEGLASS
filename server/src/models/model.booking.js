// models/Booking.js
import mongoose from 'mongoose';

const SelectedOptionSchema = new mongoose.Schema({
    option_name: { type: String },
    choice_label: { type: String },
    price_impact: { type: Number },
}, { _id: false });

const BookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    status: { type: String, enum: ['pending_assignment', 'vendor_accepted', 'vendor_enroute', 'service_started', 'service_completed', 'cancelled', 'disputed'], default: 'pending_assignment' },
    service_date: { type: Date, required: true },
    service_time_slot: { type: String, required: true },
    service_location: { type: Object, required: true },
    selected_options: [SelectedOptionSchema],
    subtotal_price: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);