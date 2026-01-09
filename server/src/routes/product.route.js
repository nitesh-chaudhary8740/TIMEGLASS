import express from 'express';
import { createProductReview, deleteProductReview, getProductById, getPublishedProducts, updateProductReview } from '../controllers/product.controller.js';
import { version } from 'mongoose';
import {verifyUser}  from "../middlewares/verifyUser.middleware.js"

const router = express.Router();

// Public route to get all published products (supports ?limit=X&skip=Y)
router.get('/published', getPublishedProducts);
router.get('/published/:id', getProductById);
// Review routes (Protected)
router.route('/:id/reviews')
    .post(verifyUser, createProductReview)
    .put(verifyUser, updateProductReview)
    .delete(verifyUser, deleteProductReview);

export default router;