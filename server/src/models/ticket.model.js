import mongoose from "mongoose";



const ticketSchema = new mongoose.Schema({

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },

  subject: { type: String, required: true },

  status: { 

    type: String, 

    enum: ['Open', 'In-Progress', 'Resolved', 'Closed'], 

    default: 'Open' 

  },

  // ... existing code ...
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderRole: { type: String, enum: ['admin', 'user'], required: true },
    content: { 
      type: String, 
      required: false // CHANGE THIS: Allow messages that only have images
    },
    // CHANGE THIS: Store as objects to keep the Cloudinary public_id
    attachments: [
      {
        url: String,
        public_id: String
      }
    ],
    createdAt: { type: Date, default: Date.now }
  }]
// ... rest of code ...

}, { timestamps: true });



const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;