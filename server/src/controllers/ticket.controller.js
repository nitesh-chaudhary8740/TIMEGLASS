import Ticket from '../models/ticket.model.js';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asynchandler.util.js';
import ErrorResponse from '../utils/errorResponse.util.js';

// 1. CREATE TICKET (User Domain)
export const createTicket = asyncHandler(async (req, res, next) => {
    const { order, subject, message, attachments } = req.body;
console.log(req.body)
    // 1. Create the ticket (The User ID is already stored here)
    const ticket = await Ticket.create({
        user: req.user.id, 
        order: order || null,
        subject,
        messages: [{
            sender: req.user.id,
            content: message,
            attachments: attachments || []
        }]
    });

    // 2. We skip the User.findByIdAndUpdate entirely. 
    // It's cleaner and faster.

    res.status(201).json({ success: true, ticket });
});

// 2. REPLY TO TICKET (Unified Controller)
// controllers/ticket.controller.js

export const replyToTicket = asyncHandler(async (req, res, next) => {
    const { content, attachments } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return next(new ErrorResponse("Ticket not found", 404));

    // PROFESSIONAL ADDITION: Prevent interaction on closed dossiers
    if (ticket.status === 'Closed') {
        return next(new ErrorResponse("This dossier is closed. Please open a new inquiry.", 400));
    }

    const isOwner = ticket.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return next(new ErrorResponse("Not authorized", 403));
    }

    ticket.messages.push({
        sender: req.user._id,
        content,
        attachments: attachments || [],
        createdAt: new Date() // Explicitly set for immediate frontend feedback
    });

    // logic: Move to In-Progress if Admin replies
    if (isAdmin && ticket.status === 'Open') {
        ticket.status = 'In-Progress';
    }
    
    // logic: Move back to Open if User replies after an Admin (Waiting for Admin)
    if (!isAdmin && ticket.status === 'In-Progress') {
        ticket.status = 'Open'; 
    }

    await ticket.save();
    res.status(200).json({ success: true, ticket });
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