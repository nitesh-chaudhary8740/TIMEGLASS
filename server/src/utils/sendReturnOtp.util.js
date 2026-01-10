import sgMail from '@sendgrid/mail';
import env from "../constants/env.js";

sgMail.setApiKey(env.EMAIL_PASS);

const sendReturnOTP = async (to, otp, orderId, recipientName) => {
  const msg = {
    to,
    from: env.EMAIL_USER,
    subject: `Return Authorization Code - #${orderId.slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: 'Helvetica', sans-serif; max-width: 500px; margin: auto; padding: 40px; border: 1px solid #fee2e2; border-radius: 24px;">
        <h1 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.3em; color: #ef4444; margin-bottom: 30px;">${env.BRAND_NAME} Secure Retrieval</h1>
        
        <p style="color: #1e293b; font-size: 16px; font-weight: 600;">Hello ${recipientName},</p>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">A pickup has been scheduled for your return request on <strong>Order #${orderId.slice(-6).toUpperCase()}</strong>. To verify the transfer of the item, please provide this code to the pickup agent:</p>
        
        <div style="background: #fef2f2; border: 2px dashed #fecaca; padding: 30px; text-align: center; border-radius: 20px; margin: 30px 0;">
          <span style="font-size: 36px; font-family: monospace; font-weight: 900; letter-spacing: 0.4em; color: #b91c1c;">${otp}</span>
        </div>
        
        <p style="color: #94a3b8; font-size: 11px; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">
          Only share this code once the agent is physically present to collect the item. 
          This is your digital receipt for the handover.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid Return Error:', error.response?.body || error.message);
    throw new Error('Failed to dispatch return OTP');
  }
};

export default sendReturnOTP;