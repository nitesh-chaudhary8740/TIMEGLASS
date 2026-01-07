import Product from '../models/product.model.js';
import asyncHandler from '../utils/asynchandler.util.js';


/**
 * @desc    Get all published products with pagination
 * @route   GET /api/products/published
 * @access  Public
 */
export const getPublishedProducts = asyncHandler(async (req, res) => {
    // 1. Get pagination parameters from query string (with defaults)
    const limit = Number(req.query.limit) || 12;
    const skip = Number(req.query.skip) || 0;

    // 2. Count total published products for the 'hasMore' logic
    const totalProducts = await Product.countDocuments({ status: 'Published' });

    // 3. Fetch the specific batch
    // We sort by createdAt: -1 to show newest arrivals first
    const products = await Product.find({ status: 'Published' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // 4. Determine if there are more products to load
    const hasMore = skip + products.length < totalProducts;

    res.status(200).json({
        success: true,
        count: products.length,
        totalProducts,
        hasMore,
        products
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