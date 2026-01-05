import express from 'express';
import rateLimit from 'express-rate-limit';
import { limiterOptions } from '../config/app.config.js';

import { 
    getProfile, 
    updateProfile, 
    addAddress, 
    requestOtp,
    verifyOtp,
    googleAuth,
    logout
} from '../controllers/user.controller.js';
import { verifyUser } from '../middlewares/verifyUser.middleware.js';
import asyncHandler from '../utils/asynchandler.util.js';

const userRouter = express.Router();

// Apply Rate Limiter to all user routes
const userLimiter = rateLimit(limiterOptions);
userRouter.use(userLimiter);
// Email OTP Flow
userRouter.post('/auth/request-otp', asyncHandler(requestOtp));
userRouter.post('/auth/verify-otp', asyncHandler(verifyOtp));

// Google OAuth Flow
userRouter.post('/auth/google', asyncHandler(googleAuth));
userRouter.post('/auth/logout', logout);
// Protected Routes
userRouter.get('/profile', verifyUser, getProfile);
userRouter.patch('/update-profile', verifyUser, updateProfile);
userRouter.post('/address', verifyUser, addAddress);

export default userRouter;