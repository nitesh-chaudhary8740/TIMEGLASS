import Ticket from '../models/ticket.model.js';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asynchandler.util.js';
import ErrorResponse from '../utils/errorResponse.util.js';
import { uploadTicketData} from '../utils/cloudinary.util.js'; // Adjust path

import { getIO } from '../../socket.js'; // Import your socket helper
// 1. CREATE TICKET
// 1. CREATE TICKET
export const createTicket = asyncHandler(async (req, res, next) => {
    // Change 'message' to 'content' here!
    const { order, subject, content } = req.body; 

    // ... upload logic ...

    const ticket = await Ticket.create({
        user: req.user.id, 
        order: order || null,
        subject,
        messages: [{
            sender: req.user.id,
            senderRole: 'user',
            content: content || (initialAttachments.length > 0 ? "Sent an attachment" : ""),
            attachments: initialAttachments
        }]
    });

    res.status(201).json({ success: true, ticket });
});

// 2. REPLY TO TICKET

export const replyToTicket = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  
  // 1. Find the ticket
  const ticket = await Ticket.findById(id);
  if (!ticket) return next(new ErrorResponse("Ticket not found", 404));

  let attachments = [];

  // 2. Process File Uploads (Only if files exist in the request)
  if (req.files && req.files.length > 0) {
    try {
      // Create promises for all file uploads
      const uploadPromises = req.files.map(file => 
        uploadTicketData(file.buffer, id)
      );

      // Wait for all files to upload to Cloudinary
      const uploadedResults = await Promise.all(uploadPromises);

      // Map the results to your schema format
      attachments = uploadedResults.map(result => ({
        url: result.url,
        public_id: result.public_id
      }));
    } catch (error) {
      console.error("Cloudinary Batch Upload Error:", error);
      return next(new ErrorResponse("Failed to upload attachments to cloud", 500));
    }
  }

// 3. Create the message object
  const newMessage = { 
    sender: req.user.id,
    senderRole: req.user.role, 
    // If text is empty but files exist, label it as an attachment
    content: content || (attachments.length > 0 ? "Sent an attachment" : ""), 
    attachments, 
    createdAt: new Date() 
  };
  
  // 4. Update ticket data
  ticket.messages.push(newMessage);
  
  // Auto-update status to 'in-progress' if Admin is the one replying
  if (req.user.role === 'admin' && ticket.status === 'open') {
    ticket.status = 'in-progress';
  }

  await ticket.save();

  // 5. Real-time Broadcast via Socket.io
  const io = getIO();
  const roomId = id.toString(); 
  
  io.to(roomId).emit("receive_message", {
    ticketId: roomId,
    message: ticket.messages[ticket.messages.length - 1],
    updatedStatus: ticket.status
  });

  // 6. Send Response
  res.status(200).json({ 
    success: true, 
    message: "Reply sent successfully", 
    newMessage 
  });
});
// 3. GET MY TICKETS (User Domain)
export const getMyTickets = asyncHandler(async (req, res, next) => {
    const tickets = await Ticket.find({ user: req.user.id }).sort("-updatedAt");
    res.status(200).json({ success: true, tickets });
});

// 5. GET SINGLE TICKET DETAILS (Unified)
export const getTicketDetails = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id)
        .populate("user", "name email")
        .populate("order", "totalAmount orderStatus createdAt");

    if (!ticket) return next(new ErrorResponse("Ticket not found", 404));

    // Security check
    if (ticket.user._id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse("Unauthorized access", 403));
    }

    res.status(200).json({ success: true, ticket });
});
// 4. GET ALL TICKETS (Admin Domain)
export const getAllTickets = asyncHandler(async (req, res, next) => {
    const tickets = await Ticket.find()
        .populate("user", "name email")
        .sort("-updatedAt");

    res.status(200).json({ success: true, tickets });
});