// utils/sendDeliveryOTP.js
import sgMail from '@sendgrid/mail';
import env from "../constants/env.js";

sgMail.setApiKey(env.EMAIL_PASS);

const sendDeliveryOTP = async (to, otp, orderId, recipientName) => {
  const msg = {
    to,
    from: env.EMAIL_USER,
    subject: `Security Code for Order #${orderId.slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: 'Helvetica', sans-serif; max-width: 500px; margin: auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 24px;">
        <h1 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.3em; color: #94a3b8; margin-bottom: 30px;">${env.BRAND_NAME} Secure Logistics</h1>
        
        <p style="color: #1e293b; font-size: 16px; font-weight: 600;">Hello ${recipientName},</p>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">Your premium timepiece is ready for handover. To finalize the delivery of <strong>Order #${orderId.slice(-6).toUpperCase()}</strong>, please provide the following secure signature code to our associate:</p>
        
        <div style="background: #1e293b; padding: 30px; text-align: center; border-radius: 20px; margin: 30px 0;">
          <span style="font-size: 36px; font-family: monospace; font-weight: 900; letter-spacing: 0.4em; color: #f59e0b;">${otp}</span>
        </div>
        
        <p style="color: #94a3b8; font-size: 11px; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">
          This code ensures your package reaches the right hands. 
          Never share this code outside of the physical delivery process.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid Delivery Error:', error.response?.body || error.message);
    throw new Error('Failed to dispatch delivery OTP');
  }
};

export default sendDeliveryOTP;