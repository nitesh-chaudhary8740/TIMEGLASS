import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from "http";

// Load environment variables
dotenv.config();

// Local source files import
import connectDB from "./src/config/db.config.js";
import userRouter from './src/routes/user.route.js';
import errorHandler from './src/middlewares/errorHandler.middleware.js';
import adminRouter from './src/routes/admin.route.js';
import { corsOptions } from './src/config/app.config.js';
import productRoutes from "./src/routes/product.route.js";
import ticketRouter from './src/routes/ticket.route.js';
import { initSocket } from './socket.js';

// Connect to Database
connectDB();

const app = express();

// --- CRITICAL FOR RENDER/VERCEL DEPLOYMENT ---
// This tells Express to trust the proxy (Render) and extract the correct IP
app.set('trust proxy', 1); 

// Middleware
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Socket 
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server, corsOptions);

// Routes
app.use('/products', productRoutes);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/tickets', ticketRouter);

// Error Handler (Keep at the bottom)
app.use(errorHandler);

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));