import User from "../models/user.model.js";


// 1. ADD OR UPDATE QUANTITY (INC/DEC)
// Get User Cart
export const getCart = async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.product');
  res.status(200).json({ success: true, cart: user.cart });
};
export const updateCartItem = async (req, res) => {
  const { productId, action } = req.body; 
  const userId = req.user.id;

  try {
    // Find user first
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Logic for existing items
      if (action === 'inc' || action === 'add') {
        user.cart[itemIndex].quantity += 1;
      } else if (action === 'dec' && user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      }
    } else {
      // Logic for new items (Treating 'add' or 'inc' as initial entry)
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    
    // Populate and return only the cart to keep response lightweight
    const updatedUser = await User.findById(userId).populate('cart.product');
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. REMOVE SINGLE PRODUCT (TRASH ICON)
export const removeItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { product: productId } } },
      { new: true }
    ).populate('cart.product');

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. CLEAR ENTIRE CART
export const clearCart = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { cart: [] } },
      { new: true }
    );
    res.status(200).json({ message: "Cart cleared", cart: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. MERGE (ONCE AFTER LOGIN)
export const mergeCart = async (req, res) => {
  // 1. Better Destructuring with fallback
  const guestItems = req.body.guestItems; 
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. CRITICAL FIX: Ensure guestItems is treated as an array
    // If it's an object containing an array, or just an array, this handles it.
    const itemsToProcess = Array.isArray(guestItems) ? guestItems : [];

    if (itemsToProcess.length === 0) {
        return res.status(200).json(user.cart);
    }

    itemsToProcess.forEach(guestItem => {
      // Use guestItem.product or guestItem._id based on what your frontend sends
      const pId = guestItem.product || guestItem._id; 
      
      const existing = user.cart.find(item => item.product.toString() === pId);
      
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        user.cart.push({ product: pId, quantity: guestItem.quantity });
      }
    });

    await user.save();
    
    // Always return populated cart so frontend is consistent
    const updatedUser = await User.findById(userId).populate('cart.product');
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    console.error("Merge Error:", error);
    res.status(500).json({ message: error.message });
  }
};