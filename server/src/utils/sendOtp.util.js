import sgMail from '@sendgrid/mail';
import env from "../constants/env.js"

sgMail.setApiKey(env.EMAIL_PASS);

const sendOTP = async (to, otp) => {
  const msg = {
    to,
    from: env.EMAIL_USER, // Must be a verified sender in SendGrid
    subject: `Your ${env.BRAND_NAME} Verification Code`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0;">
        <h2 style="text-transform: uppercase; letter-spacing: 0.2em; color: #111;">${env.BRAND_NAME}</h2>
        <p style="color: #666; font-size: 14px;">Use the following code to complete your secure login:</p>
        <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 10px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.3em; color: #b45309;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 10px; margin-top: 20px; text-transform: uppercase;">
          This code will expire in 10 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    throw new Error('Failed to send email');
  }
};

export default sendOTP;