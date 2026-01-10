import Order from "../models/order.model.js";
import Transaction from "../models/transaction.model.js";
import Return from "../models/return.model.js"; // New Model
import sendDeliveryOTP from "../utils/sendDeliveryOtp.js";
import sendReturnOTP from "../utils/sendReturnOtp.util.js"



export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product');
    const transaction = await Transaction.findOne({ order: order._id });
    res.status(200).json({ success: true, order, transaction });
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};



export const updateItemStatus = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items.product": productId },
      { $set: { "items.$.status": status, "items.$.updatedAt": Date.now() } },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order or Product not found" });

    // AUTO-UPDATE GLOBAL STATUS: If all items are Shipped/Cancelled, move order to Shipped
    const allProcessed = order.items.every(item => ['Shipped', 'Cancelled'].includes(item.status));
    if (allProcessed && order.orderStatus === 'Processing') {
      order.orderStatus = 'Shipped';
      order.shippedAt = Date.now();
      await order.save();
    }

    res.status(200).json({ success: true, message: `Item updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Item update failed", error: error.message });
  }
};

// --- INITIATE DELIVERY (Send OTP) ---
export const initiateDelivery = async (req, res) => {
  try {
    const { id } = req.params; // Order ID
    const { productId } = req.body; // Product ID

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the specific item's OTP fields
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, "items.product": productId },
      { 
        $set: { 
          "items.$.itemOTP": otp, 
          "items.$.itemOtpExpires": Date.now() + 3600000 
        } 
      },
      { new: true }
    );

    await sendDeliveryOTP(order.recipient.email, otp, order._id.toString(), order.recipient.name);
    console.log("sended otp",otp)
    res.status(200).json({ success: true, message: "Security code sent for this item." });
  } catch (error) {
    res.status(500).json({ message: "OTP failed", error: error.message });
  }
};

export const confirmDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp, productId } = req.body;
    console.log(otp)
    const order = await Order.findOne({ _id: id, "items.product": productId });
    const item = order.items.find(i => i.product.toString() === productId || i.product?.$oid === productId);
    console.log(item.itemOTP,"dh")

    if (!item.itemOTP || item.itemOTP !== otp || Date.now() > item.itemOtpExpires) {
      return res.status(400).json({ message: "Invalid or expired item security code." });
    }
    console.log("here",)

    // Mark as delivered and clear OTP for THIS item only
    await Order.updateOne(
      { _id: id, "items.product": productId },
      { 
        $set: { 
          "items.$.status": 'Delivered',
          "items.$.deliveredAt": Date.now(),
          "items.$.itemOTP": null,
          "items.$.itemOtpExpires": null
        } 
      }
    );

    res.status(200).json({ success: true, message: "Item delivered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Handover failed" });
  }
};

// 1. Initiate Return (Sends OTP)
export const initiateReturnPickup = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const returnReq = await Return.findOne({ orderId, productId }).populate('user', 'name email');
    
    if (!returnReq) return res.status(404).json({ message: "Return record not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update Return Document (Schema now includes these fields)
    returnReq.returnOTP = otp;
    returnReq.otpExpires = Date.now() + 3600000; // 1 Hour expiry
    returnReq.returnStatus = 'Pickup_Scheduled';
    await returnReq.save();

    await sendReturnOTP(returnReq.user.email, otp, orderId, returnReq.user.name);
    
    res.status(200).json({ success: true, message: "Return OTP sent to customer." });
  } catch (error) {
    res.status(500).json({ message: "Return initiation failed", error: error.message });
  }
};

// 2. Verify Return (Completes the Handover)
export const verifyReturnPickup = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { otp } = req.body;
    const returnReq = await Return.findOne({ orderId, productId });

    if (!returnReq || returnReq.returnOTP !== otp || Date.now() > returnReq.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired return code." });
    }

    // Update Return Record
    returnReq.returnStatus = 'In_Transit';
    returnReq.returnOTP = undefined; // Clear OTP
    returnReq.otpExpires = undefined;
    await returnReq.save();

    // Update main Order status to 'Returned'
    await Order.updateOne(
      { _id: orderId, "items.product": productId },
      { $set: { "items.$.status": 'Returned' } }
    );

    res.status(200).json({ success: true, message: "Return pickup verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Return verification failed", error: error.message });
  }
};

// 3. NEW: Rollback Return (Resets if OTP sent by mistake)
export const rollbackReturnPickup = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const returnReq = await Return.findOne({ orderId, productId });

    if (!returnReq) return res.status(404).json({ message: "Return record not found" });

    // Reset fields to original requested state
    returnReq.returnStatus = 'Pending_Approval';
    returnReq.returnOTP = undefined;
    returnReq.otpExpires = undefined;
    await returnReq.save();

    res.status(200).json({ success: true, message: "Return process rolled back to Pending Approval." });
  } catch (error) {
    res.status(500).json({ message: "Rollback failed", error: error.message });
  }
};

// --- GENERAL ---

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.orderStatus === 'Delivered') return res.status(400).json({ message: "Cannot cancel delivered order." });

    order.orderStatus = 'Cancelled';
    order.items.forEach(item => { item.status = 'Cancelled'; });
    await order.save();
    res.status(200).json({ success: true, message: "Order cancelled." });
  } catch (error) {
    res.status(500).json({ message: "Cancellation failed", error: error.message });
  }
};

export const rollbackDeliveryInitiation = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { deliveryOTP: null, otpExpires: null });
    res.status(200).json({ success: true, message: "Handover aborted." });
  } catch (error) {
    res.status(500).json({ message: "Abort Error", error: error.message });
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

