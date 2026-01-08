import express from 'express';
import rateLimit from 'express-rate-limit';
import { limiterOptions } from '../config/app.config.js';

import { 
    getProfile, 
    updateProfile, 
    requestOtp,
    verifyOtp,
    googleAuth,
    logout,
    
} from '../controllers/user.controller.js';

// Import New Cart Controllers
import { 
    updateCartItem, 
    removeItem, 
    clearCart, 
    mergeCart, 
    getCart
} from '../controllers/cart.controller.js'; 

import { verifyUser } from '../middlewares/verifyUser.middleware.js';
import asyncHandler from '../utils/asynchandler.util.js';
import { addAddress, deleteAddress, updateAddress } from '../controllers/address.controller.js';
import { createNewOrder, getMyOrders, getOrderById } from '../controllers/order.controller.js';
import { createRazorpayOrder } from '../controllers/payment.controller.js';

const userRouter = express.Router();

const userLimiter = rateLimit(limiterOptions);
userRouter.use(userLimiter);

// --- AUTHENTICATION ---
userRouter.post('/auth/request-otp', requestOtp);
userRouter.post('/auth/verify-otp', verifyOtp);
userRouter.post('/auth/google', asyncHandler(googleAuth));
userRouter.post('/auth/logout', logout);

// --- PROFILE ---
userRouter.get('/profile', verifyUser, getProfile);
userRouter.patch('/profile', verifyUser, updateProfile);

// --- CART ROUTES ---
// Note: We use PATCH for updates and POST for the one-time merge logic
userRouter.get('/cart', verifyUser, asyncHandler(getCart));
userRouter.patch('/cart/update', verifyUser, asyncHandler(updateCartItem));
userRouter.delete('/cart/remove/:productId', verifyUser, asyncHandler(removeItem));
userRouter.delete('/cart/clear', verifyUser, asyncHandler(clearCart));
userRouter.post('/cart/merge', verifyUser, asyncHandler(mergeCart));

// --- ADDRESS ROUTES ---
userRouter.route('/address')
  .post(verifyUser, addAddress);

userRouter.route('/address/:id')
  .patch(verifyUser, updateAddress)
  .delete(verifyUser, deleteAddress);
//--- Order Routes and Pyament
userRouter.post('/payment/razorpay-order', verifyUser, createRazorpayOrder);
userRouter.route("/order").post(verifyUser,createNewOrder)
userRouter.route("/order/my").get(verifyUser,getMyOrders)
userRouter.get("/order/:id", verifyUser, getOrderById);

export default userRouter;