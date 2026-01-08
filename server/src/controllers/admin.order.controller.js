// controllers/adminOrderController.js

import Order from "../models/order.model.js";
import Transaction from "../models/transaction.model.js";
import sendDeliveryOTP from "../utils/sendDeliveryOtp.js";

// 1. GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    // We populate 'user' to get name/email and 'items.product' to get the latest watch details
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// 2. GET ALL TRANSACTIONS (Financial Logs)
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('order', 'totalAmount')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error });
  }
};

// 3. UPDATE ORDER STATUS (The "Action" to complete/ship)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    } else if (status === 'Shipped') {
      order.shippedAt = Date.now();
    }

    await order.save();
    res.status(200).json({ success: true, message: `Order marked as ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};
// 1. Get Single Order Details
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');
    
    // Also find the associated transaction for this order
    const transaction = await Transaction.findOne({ order: order._id });

    res.status(200).json({ success: true, order, transaction });
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};



// 1. INITIATE DELIVERY (Generate & Send OTP)
export const initiateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.orderStatus !== 'Shipped') {
      return res.status(400).json({ message: "Order must be in 'Shipped' status to initiate delivery." });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP and Expiry (1 hour) to the order
    order.deliveryOTP = otp;
    order.otpExpires = Date.now() + 3600000; 
    await order.save();

    // Send the email to the RECIPIENT email
    await sendDeliveryOTP(
      order.recipient.email, 
      otp, 
      order._id.toString(), 
      order.recipient.name
    );

  res.status(200).json({ success: true, message: "Delivery OTP dispatched to recipient." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 2. CONFIRM DELIVERY (Verify OTP & Update Status)
export const confirmDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const order = await Order.findById(id);

    if (!order.deliveryOTP || order.deliveryOTP !== otp) {
      return res.status(400).json({ message: "Invalid or expired security code." });
    }

    if (Date.now() > order.otpExpires) {
      return res.status(400).json({ message: "OTP has expired. Please generate a new one." });
    }

    // Verification Success
    order.orderStatus = 'Delivered';
    order.deliveredAt = Date.now();
    order.deliveryOTP = undefined; // Clear sensitive data
    order.otpExpires = undefined;
    
    await order.save();

    res.status(200).json({ success: true, message: "Order successfully marked as Delivered." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
// adminOrderController.js

export const rollbackDeliveryInitiation = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Clear the security fields
    order.deliveryOTP = null;
    order.otpExpires = null;
    await order.save();

    res.status(200).json({ 
      success: true, 
      message: "Delivery handover aborted. Security codes invalidated." 
    });
  } catch (error) {
    res.status(500).json({ message: "Abort Error", error: error.message });
  }
};