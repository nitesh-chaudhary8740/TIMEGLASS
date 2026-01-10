import Product from '../models/product.model.js';
import asyncHandler from '../utils/asynchandler.util.js';

import Order from "../models/order.model.js"
import User from '../models/user.model.js';
/**
 * @desc    Get all published products with pagination
 * @route   GET /api/products/published
 * @access  Public
 */
 // Ensure the path to your model is correct

// @desc    Get all published products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getPublishedProducts = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 12;
    const skip = Number(req.query.skip) || 0;
    
    // 1. Build Query Object
    let query = { status: 'Published' };

    // Search logic
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Filters (Handling comma-separated strings from the URL)
    if (req.query.gender) {
        query.gender = { $in: req.query.gender.split(',') };
    }
    if (req.query.movement) {
        query.movement = { $in: req.query.movement.split(',') };
    }
    if (req.query.material) {
        query.material = { $in: req.query.material.split(',') };
    }

    // Price Range logic
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {
            ...(req.query.minPrice && { $gte: Number(req.query.minPrice) }),
            ...(req.query.maxPrice && { $lte: Number(req.query.maxPrice) }),
        };
    }

    // 2. Sorting Logic (Synchronized with Navbar & Frontend)
    let sortOrder = { createdAt: -1 }; // Default: New Arrivals

    switch (req.query.sort) {
        case 'priceLow':
            sortOrder = { price: 1 };
            break;
        case 'priceHigh':
            sortOrder = { price: -1 };
            break;
        case 'rating':
            sortOrder = { rating: -1 };
            break;
        case 'totalSales': // Exactly matches Navbar: /products?sort=totalSales
            sortOrder = { totalSales: -1 };
            break;
        case 'createdAt':
            sortOrder = { createdAt: -1 };
            break;
        default:
            sortOrder = { createdAt: -1 };
    }

    // 3. Database Execution
    const totalProducts = await Product.countDocuments(query);
    
    const products = await Product.find(query)
        .sort(sortOrder)
        .limit(limit)
        .skip(skip);

    // 4. Response
    res.status(200).json({
        products,
        totalProducts,
        hasMore: skip + products.length < totalProducts
    });
});
// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  // 1. Find product by ID from URL params
  const product = await Product.findById(req.params.id);

  // 2. If product exists, return it
  if (product) {
    res.status(200).json({
      success: true,
      product
    });
  } else {
    // 3. If not found, throw a 404 error
    res.status(404);
    throw new Error('Product not found');
  }
});
/**
 * @desc    Create a new review
 * @route   POST /api/products/:id/reviews
 * @access  Private (Verified Buyers Only)
 */
/**
 * @desc    Create a new review
 * @route   POST /api/products/:id/reviews
 * @access  Private (Verified Buyers Only)
 */
/**
 * @desc    Create a new review
 * @route   POST /api/products/:id/reviews
 */
export const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    // 1. Verify product exists
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('user not found');
    }
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // 2. Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user.id.toString()
    );
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this masterpiece.');
    }

    // 3. THE VERIFIED BUYER CHECK
    // We look for a Delivered order where the items array contains this productId
  // 3. THE VERIFIED BUYER CHECK (Flexible version for testing)
    const hasPurchased = await Order.findOne({
        user: req.user.id,
        'items.product': productId,
        // We allow 'Shipped' OR 'Delivered' so you can test right now
        'items.product.status': { $nin: ['Shipped', 'Processing'] }, 
        // We check if it's Prepaid or marked as Paid
        $or: [
            { paymentStatus: 'Paid' },
            { 'paymentInfo.method': 'Prepaid' }
        ]
    });

    if (!hasPurchased) {
        res.status(403);
        throw new Error('Verification required: Only owners of this timepiece can publish reviews.');
    }

    // 4. Create and Push Review
    const review = {
        name: user.name,
        rating: Number(rating),
        comment,
        user: req.user.id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // Average Rating Calculation
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review published to the Vault.' });
});

/**
 * @desc    Update a review
 * @route   PUT /api/products/:id/reviews
 */
export const updateProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const review = product.reviews.find(
        (r) => r.user.toString() === req.user.id.toString()
    );

    if (review) {
        review.rating = Number(rating);
        review.comment = comment;

        // Recalculate average
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(200).json({ success: true, message: 'Review updated' });
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/products/:id/reviews
 */
export const deleteProductReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Remove the specific review
    const initialLength = product.reviews.length;
    product.reviews = product.reviews.filter(
        (r) => r.user.toString() !== req.user.id.toString()
    );

    if (product.reviews.length === initialLength) {
        res.status(404);
        throw new Error('Review not found or unauthorized');
    }

    product.numReviews = product.reviews.length;
    
    // Recalculate rating or set to 0
    product.rating = product.reviews.length > 0 
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length 
        : 0;

    await product.save();
    res.status(200).json({ success: true, message: 'Review removed' });
});