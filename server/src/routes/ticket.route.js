// routes/ticket.routes.js
import express from 'express';
import { createTicket, getAllTickets, getMyTickets, getTicketDetails, replyToTicket } from '../controllers/ticket.controller.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.middleware.js';
import { verifyUser } from '../middlewares/verifyUser.middleware.js';
import { verifyAnyToken } from '../middlewares/verifyAnyToken.js';

import { uploadChat } from '../middlewares/chat.multer.miiddlerware.js';


const ticketRouter = express.Router();

// 1. Domain Specific Actions
ticketRouter.route("/").post( verifyUser, createTicket); 
ticketRouter.get('/', verifyAdmin, getAllTickets); 
ticketRouter.get('/my-tickets', verifyUser, getMyTickets);

// 2. Shared Interaction (The "Universal" Gate)
ticketRouter.post('/:id', verifyAnyToken,uploadChat.array('attachments', 5), replyToTicket)
//this is only route which is receing post request in this URL
ticketRouter.route("/:id").get(verifyAnyToken, getTicketDetails); 

export default ticketRouter;