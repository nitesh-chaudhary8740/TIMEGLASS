import razorpay from "../config/razor.config.js"
import asyncHandler from "../utils/asynchandler.util.js";
import crypto from 'crypto';

export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;
console.log("rec")
    if (!amount) {
        res.status(400);
        throw new Error("Amount is required to initiate payment");
    }

    const options = {
        amount: Math.round(Number(amount * 100)), // Rounding to avoid floating point issues
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
        res.status(500);
        throw new Error("Razorpay Order Creation Failed");
    }

    res.status(200).json({
        success: true,
        order, 
    });
});


export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        res.status(200).json({ success: true, message: "Payment Verified" });
    } else {
        res.status(400);
        throw new Error("Payment Verification Failed (Invalid Signature)");
    }
});