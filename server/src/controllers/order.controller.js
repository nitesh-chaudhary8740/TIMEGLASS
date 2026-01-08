


import crypto from 'crypto';
import env from "../constants/env.js";
import asyncHandler from "../utils/asynchandler.util.js";
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';

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
            image: productData.images[0] // Take the first image snapshot
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