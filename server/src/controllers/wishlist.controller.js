

// @desc    Toggle Wishlist (Add/Remove)

import User from "../models/user.model.js";

// @route   POST /api/wishlist/toggle
export const toggleWishlist = async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isAlreadyWishlisted = user.wishlist.includes(productId);

    if (isAlreadyWishlisted) {
        // Remove from wishlist
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
        // Add to wishlist
        user.wishlist.push(productId);
    }

    await user.save();
    res.status(200).json({ 
        message: isAlreadyWishlisted ? "Removed from wishlist" : "Added to wishlist",
        wishlist: user.wishlist 
    });
};

// @desc    Get user wishlist with product details
// @route   GET /api/wishlist
export const getWishlist = async (req, res) => {
    const user = await User.findById(req.user.id).populate("wishlist");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({ wishlist: user.wishlist });
};