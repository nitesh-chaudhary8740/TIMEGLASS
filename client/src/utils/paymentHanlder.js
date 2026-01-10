import axios from 'axios';
import { BASE_API_URL } from '../constants/env.js';

export const initializeRazorpayPayment = async ({
  totalAmount,
  recipient,
  shippingAddress,
  items,
  user,
  createOrder,     // From useCreateOrderMutation
  clearCartApi,    // From useClearCartMutation
  dispatch,
  navigate,
  clearCartLocal   // Redux action
}) => {
  try {
    const finalAmount = totalAmount + (totalAmount > 2000 ? 0 : 150);

    // 1. Get Razorpay Order ID from Backend
    const { data: rzpOrder } = await axios.post(`${BASE_API_URL}/user/payment/razorpay-order`, { 
      amount: finalAmount 
    },{withCredentials:true});

    if (!rzpOrder.success) throw new Error("Could not initiate Razorpay order.");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: rzpOrder.order.amount,
      currency: "INR",
      name: "TIMEGLASS",
      description: "Luxury Watch Purchase",
      order_id: rzpOrder.order.id,
      
      handler: async function (response) {
        // SUCCESS: Now we verify and save on our backend
        const finalPayload = {
          recipient,
          shippingAddress,
          items: items.map(item => ({ product: item._id, quantity: item.quantity })),
          paymentInfo: {
            method: 'Prepaid',
            id: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          }
        };

        try {
          const result = await createOrder(finalPayload).unwrap();
          
          if (result.success) {
            // Clear Database Cart
            await clearCartApi().unwrap();
            // Clear Local Redux Cart
            dispatch(clearCartLocal());
            // Redirect
         navigate(`/order-success/${result.order._id}`);
          }
        } catch (dbError) {
          console.error("Payment successful, but order failed to save:", dbError);
          alert("Payment verified, but we faced an issue saving your order. Please contact support.");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: { color: "#000000" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment Initiation Error:", err);
    alert(err.response?.data?.message || "Payment service unavailable.");
  }
};