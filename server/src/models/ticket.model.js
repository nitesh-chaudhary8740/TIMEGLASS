import mongoose from "mongoose";
const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional: link to specific watch
  subject: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Open', 'In-Progress', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin or User
    content: { type: String, required: true },
    attachments: [String], // For photos of watch defects
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
const Ticket  = mongoose.model('Ticket',ticketSchema)
export default Ticket;
//src//models/ticket.model.js