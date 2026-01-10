


import crypto from 'crypto';
import env from "../constants/env.js";
import asyncHandler from "../utils/asynchandler.util.js";
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import Return from "../models/return.model.js"
import sendOrderConfirmation from '../utils/sendOrderConfirmationEmail.util.js';
export const createNewOrder = asyncHandler(async (req, res) => {
    const { recipient, shippingAddress, items, paymentInfo } = req.body;

    // 1. VERIFY RAZORPAY SIGNATURE (Security Layer)
    const { id: payment_id, razorpayOrderId: order_id, signature } = paymentInfo;
    const body = order_id + "|" + payment_id;
    
    const expectedSignature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== signature) {
        res.status(400);
        throw new Error("Payment verification failed! Transaction is not authentic.");
    }

    // 2. RECONSTRUCT ITEMS FROM DB (Price Integrity Layer)
    const productIds = items.map(i => i.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    let itemsPrice = 0;
    const finalOrderItems = items.map(item => {
        const productData = dbProducts.find(p => p._id.toString() === item.product);
        if (!productData) {
            throw new Error(`Product not found: ${item.product}`);
        }
        // Check if stock is sufficient before proceeding
        if (productData.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${productData.name}`);
        }
        const price = productData.price;
        itemsPrice += price * item.quantity;

        return {
            product: productData._id,
            name: productData.name,
            price: price, // Fetched from DB
            quantity: item.quantity,
            image: productData.images[0].url // Take the first image snapshot
        };
    });

    // 3. CALCULATE TOTALS
    const shippingPrice = itemsPrice > 2000 ? 0 : 150;
    const totalAmount = itemsPrice + shippingPrice;

    // 4. SAVE ORDER TO DATABASE
    const order = await Order.create({
        user: req.user.id,
        recipient,
        items: finalOrderItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        totalAmount,
        paymentStatus: 'Paid',
        paymentInfo: {
            method: 'Prepaid',
            razorpayPaymentId: payment_id,
            razorpayOrderId: order_id
        }
    });
// 4. UPDATE STOCK AND SALES (The New Part)
    // We loop through the order items and update the Product collection
    const updateProductsPromises = finalOrderItems.map(item => {
        return Product.findByIdAndUpdate(item.product, {
            $inc: { 
                stock: -item.quantity,    // Decrease stock by quantity ordered
                totalSales: item.quantity // Increase total sales by quantity ordered
            }
        });
    });
    await Promise.all(updateProductsPromises);
    // 5. CREATE TRANSACTION RECORD (For Finance/History)
    await Transaction.create({
        order: order._id,
        user: req.user.id,
        gatewayTransactionId: payment_id,
        gatewayOrderId: order_id,
        amount: totalAmount,
        paymentStatus: 'Completed',
        paymentMethod: 'Razorpay'
    });

    // 6. CLEAR THE USER'S CART IN DB
    await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] },$push: { orderHistory: order._id } });
const userEmail =  recipient.email||req.user.email; 
sendOrderConfirmation(order, userEmail);
    // 7. SUCCESS RESPONSE
    res.status(201).json({
        success: true,
        order,
        message: "Order placed and verified successfully"
    });
});
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email phone") // Correct: Get buyer's name/email
        .populate("items.product");           // Correct: Populate the array of products

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    // Security Check
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Not authorized to view this order");
    }

    res.status(200).json({
        success: true,
        order
    });
});
export const getMyOrders = asyncHandler(async (req, res) => {
 
    const user = await User.findById(req.user.id).populate({
        path: 'orderHistory',
        options: { sort: { 'createdAt': -1 } } // Keep most recent orders at the top
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // 3. Return the populated array
    res.status(200).json({
        success: true,
        count: user.orderHistory.length,
        orders: user.orderHistory,
    });
});
export const cancelOrderItem = asyncHandler(async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const userId = req.user.id; // From auth middleware

    const order = await Order.findOne({ _id: orderId, user: userId });
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in order" });
    // Logic: Cannot cancel if already Shipped or Delivered
    if ([ 'Delivered',"Cancelled","Returned"].includes(item.status)) {
      return res.status(400).json({ message: "Cannot cancel an item already shipped or delivered." });
    }

    item.status = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, message: "Item cancelled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Cancellation failed", error: error.message });
  }
});
export const requestItemReturn = asyncHandler(async (req, res) => {
  const { orderId, productId } = req.params;
  const { reason, description, images } = req.body; // Images are often required for defective items

  // 1. Fetch Order
  const order = await Order.findOne({ _id: orderId, user: req.user.id });
  if (!order) return res.status(404).json({ message: "Order not found" });

  // 2. Find specific Item in the Order
  const item = order.items.find(i => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: "Item not found in this order" });

  // 3. Status & Window Validation
  if (item.status !== 'Delivered') {
    return res.status(400).json({ message: "Only delivered items can be returned." });
  }

  // Double check if already requested (prevent duplicate Return documents)
  const existingReturn = await Return.findOne({ orderId, productId });
  if (existingReturn) {
    return res.status(400).json({ message: "A return request already exists for this item." });
  }

  // 4. Time Logic Calculation
  // We fetch returnDays from the product if not already on the item
  const product = await Product.findById(productId);
  const returnDaysAllowed = product?.returnDays || 7;
  
  const deliveryDate = new Date(item.deliveredAt).getTime();
  const now = Date.now();
  const daysSinceDelivery = (now - deliveryDate) / (1000 * 60 * 60 * 24);

  if (daysSinceDelivery > returnDaysAllowed) {
    return res.status(400).json({ 
      message: `Return window expired. It was valid for ${returnDaysAllowed} days after delivery.` 
    });
  }

  // 5. Atomic Update
  // We create the return record FIRST. If this fails, the order remains 'Delivered'
  await Return.create({
    orderId,
    productId,
    user: req.user.id,
    reason,
    description,
    images: images || [], // URLs from Cloudinary/S3
    returnStatus: 'Pending_Approval'
  });

  // Update the Item Status in the Order Document
  // We use findOneAndUpdate to ensure the update is targeted correctly
  await Order.updateOne(
    { _id: orderId, "items.product": productId },
    { $set: { "items.$.status": 'Return_Requested' } }
  );

  res.status(201).json({ 
    success: true, 
    message: "Return request logged in the asset ledger. Admin review pending." 
  });
});