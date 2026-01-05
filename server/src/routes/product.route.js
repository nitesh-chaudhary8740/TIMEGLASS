import express from 'express';
import { getPublishedProducts } from '../controllers/product.controller.js';


const router = express.Router();

// Public route to get all published products (supports ?limit=X&skip=Y)
router.get('/published', getPublishedProducts);

export default router;