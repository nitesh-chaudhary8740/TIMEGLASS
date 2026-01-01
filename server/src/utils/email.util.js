import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (options) => {
  const msg = {
    to: options.email,
    from: process.env.FROM_EMAIL, 
    subject: options.subject,
    text: options.message,
    html: options.html || `<div>${options.message}</div>`,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    return { success: false, error };
  }
};