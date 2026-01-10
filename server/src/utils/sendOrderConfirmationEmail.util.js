import sgMail from '@sendgrid/mail';
import env from "../constants/env.js";

sgMail.setApiKey(env.EMAIL_PASS);

const sendOrderConfirmation = async (order, recipientEmail) => {
  const itemsHtml = order.items.map(item => {
    // 1. ADVANCED ENCODING
    // We split the URL to encode the path separately from the protocol/domain
    // This handles (Black), quotes ", and spaces perfectly.
    const baseUrl = "https://res.cloudinary.com/nitesh8740/image/upload/";
    const pathPart = item.image.split('/upload/')[1];
    
    // We use f_jpg to force a standard image format that all email clients support
    const transformedPath = "f_jpg,w_200,c_limit/" + pathPart;
    const safeImageUrl = baseUrl + encodeURI(transformedPath);

    return `
      <div style="display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="width: 70px; height: 70px; flex-shrink: 0; margin-right: 16px;">
          <img 
            src="${safeImageUrl}" 
            alt="${item.name}" 
            width="70" 
            height="70" 
            style="display: block; width: 70px; height: 70px; border-radius: 12px; object-fit: cover; background-color: #f8fafc; border: 1px solid #e2e8f0;" 
          />
        </div>
        <div style="flex: 1;">
          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.4;">${item.name}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Qty: ${item.quantity} × ₹${item.price.toLocaleString()}</p>
        </div>
        <div style="margin-left: 12px; font-size: 14px; font-weight: 700; color: #0f172a;">
          ₹${(item.price * item.quantity).toLocaleString()}
        </div>
      </div>
    `;
  }).join('');

  const orderNumber = order._id.toString().slice(-8).toUpperCase();

  const msg = {
    to: recipientEmail,
    from: {
        email: env.EMAIL_USER,
        name: env.BRAND_NAME 
    },
    subject: `Confirmed: Order #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 32px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5em; color: #94a3b8;">${env.BRAND_NAME}</h1>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="font-size: 24px; font-weight: 300; color: #0f172a; margin: 0;">Your order is confirmed.</h2>
          <p style="color: #64748b; font-size: 14px;">We're getting your timepiece ready for delivery.</p>
        </div>

        <div style="background: #fafafa; border-radius: 24px; padding: 24px; border: 1px solid #f1f5f9;">
          <p style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 15px;">Summary for #${orderNumber}</p>
          ${itemsHtml}
          
          <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <table width="100%">
              <tr>
                <td style="font-size: 14px; color: #64748b;">Total Paid</td>
                <td align="right" style="font-size: 18px; font-weight: 700; color: #0f172a;">₹${order.totalAmount.toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${env.FRONTEND_URL}/profile/orders" style="background: #0f172a; color: #ffffff; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: 600;">VIEW ORDER DETAILS</a>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Email Error:', error);
    return false;
  }
};

export default sendOrderConfirmation;