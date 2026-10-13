import { Resend } from 'resend';
import { Order } from '@/types/ecommerce';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'GutVaidya <onboarding@resend.dev>';
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'gutvaidya@gmail.com';

// Base HTML layout for Gut Vaidya branded emails
function emailWrapper(content: string, previewText: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Gut Vaidya</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f9f4; color: #1c241b; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e6edd9; box-shadow: 0 4px 20px rgba(31,79,22,0.05); }
    .header { background-color: #163c0f; padding: 32px 24px; text-align: center; }
    .header h1 { color: #f8f5ec; margin: 0; font-size: 26px; font-family: Georgia, serif; letter-spacing: 0.5px; }
    .header p { color: #c39b62; margin: 6px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
    .body { padding: 32px 24px; }
    .footer { background: #0f280a; padding: 24px; text-align: center; color: rgba(255,255,255,0.7); font-size: 12px; }
    .footer a { color: #c39b62; text-decoration: none; }
    .btn { display: inline-block; background-color: #1f4f16; color: #ffffff !important; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 20px; }
    .item-row { border-bottom: 1px solid #f0f4ec; padding: 12px 0; }
    .badge { display: inline-block; background: #e6edd9; color: #1f4f16; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${previewText}
  </div>
  <div class="container">
    <div class="header">
      <h1>GutVaidya</h1>
      <p>Traditional Wellness & Health Mix</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p style="margin:0 0 8px 0;"><strong>GutVaidya Health Mix</strong> • Lic. No. 21224172000058 (FSSAI Registered)</p>
      <p style="margin:0 0 8px 0;">Need support? Email us at <a href="mailto:support@thegutvaidya.com">support@thegutvaidya.com</a> or call +91 78928 91239</p>
      <p style="margin:0; color: rgba(255,255,255,0.4);">© ${new Date().getFullYear()} GutVaidya. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendOrderConfirmationEmail(order: Order) {
  if (!resend) {
    console.log('[Email Simulation] Resend API Key not set. Simulated order confirmation for:', order.customer_email);
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
    <div class="item-row" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: #163c0f; font-size: 14px;">${item.product_name}</strong><br>
        <span style="font-size: 12px; color: #666;">Qty: ${item.quantity} × ₹${item.unit_price}</span>
      </div>
      <div style="font-weight: 600; color: #163c0f; font-size: 14px;">₹${item.total_price}</div>
    </div>
  `
    )
    .join('');

  const bodyContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">Order Confirmed</span>
      <h2 style="color: #163c0f; font-family: Georgia, serif; margin: 12px 0 6px 0;">Thank You for Your Order!</h2>
      <p style="color: #666; font-size: 14px; margin: 0;">Order Reference: <strong>${order.order_number}</strong></p>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #333;">
      Dear ${order.customer_name},<br>
      We have received your payment and our kitchen is carefully preparing your wholesome GutVaidya order with freshly handpicked sprouted grains and natural herbs.
    </p>

    <div style="margin: 24px 0; background: #fafbf9; border-radius: 12px; padding: 16px; border: 1px solid #e6edd9;">
      <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #163c0f;">Order Summary</h3>
      ${itemsHtml}
      <div style="margin-top: 16px; pt: 12px; border-top: 2px dashed #e6edd9; font-size: 13px;">
        <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
          <span>Subtotal:</span><span>₹${order.subtotal}</span>
        </div>
        ${order.discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom: 4px; color: #1f4f16;"><span>Discount (${order.coupon_code || 'Coupon'}):</span><span>-₹${order.discount}</span></div>` : ''}
        <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
          <span>Shipping:</span><span>${order.shipping_charge === 0 ? 'FREE' : `₹${order.shipping_charge}`}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size: 16px; font-weight: bold; color: #163c0f; margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;">
          <span>Total Paid:</span><span>₹${order.total}</span>
        </div>
      </div>
    </div>

    <div style="margin: 20px 0; font-size: 13px; color: #555; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 12px;">
      <strong>Delivery Address:</strong><br>
      ${order.shipping_address.name}<br>
      ${order.shipping_address.address_line_1}, ${order.shipping_address.address_line_2 || ''}<br>
      ${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.postal_code}<br>
      Phone: ${order.shipping_address.phone}
    </div>

    <div style="text-align: center; margin-top: 28px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thegutvaidya.com'}/account/orders" class="btn">
        View Order Status
      </a>
    </div>
  `;

  try {
    // 1. Send Order Confirmation directly to the Customer's email
    const customerResult = await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: `Your GutVaidya Order Confirmation #${order.order_number}`,
      html: emailWrapper(bodyContent, `Your GutVaidya order #${order.order_number} has been confirmed!`),
    });

    // If Resend free tier blocks external customer email because custom domain is not yet verified at resend.com/domains:
    if (customerResult.error) {
      console.warn(`[Resend Notice] Direct delivery to ${order.customer_email} was limited by Resend: ${customerResult.error.message}`);
      if (order.customer_email.toLowerCase() !== adminEmail.toLowerCase()) {
        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `[Customer Invoice Copy] Order Confirmation #${order.order_number} for ${order.customer_email}`,
          html: emailWrapper(
            `<div style="background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 14px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; line-height: 1.5;">
              <strong>Testing Mode Notice:</strong> This is an exact preview of the customer confirmation email intended for <strong>${order.customer_email}</strong>. Once you add and verify your domain at <a href="https://resend.com/domains" target="_blank">resend.com/domains</a>, this email will be delivered directly to the customer's email address worldwide.
            </div>` + bodyContent,
            `Customer confirmation copy for ${order.customer_name}`
          ),
        });
      }
    }

    // 2. Also notify Store Administrator (gutvaidya@gmail.com)
    const adminEmailBody = `
      <div style="background: #163c0f; color: #ffffff; padding: 18px; border-radius: 12px; margin-bottom: 20px;">
        <span style="background: #c39b62; color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase; font-weight: bold;">Store Alert</span>
        <h2 style="color: #ffffff; margin: 8px 0 4px 0; font-family: Georgia, serif;">New Order #${order.order_number} Received!</h2>
        <p style="margin: 0; color: #e5cca8; font-size: 14px;">Total Value: ₹${order.total} • Status: PAID</p>
      </div>

      <div style="background: #f4f8f2; border: 1px solid #ccdbb6; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #163c0f; font-size: 15px;">Customer & Delivery Details</h3>
        <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Name:</strong> ${order.customer_name}</p>
        <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Email:</strong> <a href="mailto:${order.customer_email}">${order.customer_email}</a></p>
        <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Phone:</strong> <a href="tel:${order.customer_phone || order.shipping_address.phone}">${order.customer_phone || order.shipping_address.phone}</a></p>
        <p style="margin: 6px 0 0 0; font-size: 13px;"><strong>Shipping Address:</strong><br>
          ${order.shipping_address.address_line_1}, ${order.shipping_address.address_line_2 || ''}<br>
          ${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.postal_code}
        </p>
      </div>

      <div style="background: #ffffff; border: 1px solid #e6edd9; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #163c0f; font-size: 15px;">Ordered Formulations</h3>
        ${itemsHtml}
        <div style="margin-top: 12px; pt: 10px; border-top: 1px solid #e6edd9; font-size: 14px; font-weight: bold; color: #163c0f; display: flex; justify-content: space-between;">
          <span>Total Collected:</span>
          <span>₹${order.total}</span>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders" class="btn">
          View & Dispatch Order in Admin Portal
        </a>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚨 New Order #${order.order_number} Received (₹${order.total}) - GutVaidya Store`,
      html: emailWrapper(adminEmailBody, `New order #${order.order_number} from ${order.customer_name} for ₹${order.total}`),
    });
  } catch (err) {
    console.error('Failed to dispatch transactional email', err);
  }
}

export async function sendOrderStatusUpdateEmail(order: Order, newStatus: string) {
  if (!resend) {
    console.log(`[Email Simulation] Order #${order.order_number} status changed to ${newStatus}`);
    return;
  }

  const statusDescriptions: Record<string, string> = {
    processing: 'Your wellness mix is being fresh-ground and packaged with care.',
    packed: 'Your package has been securely sealed and is ready for pickup.',
    shipped: 'Your GutVaidya package is in transit! It will arrive at your doorstep shortly.',
    out_for_delivery: 'Your package is out for delivery today with our courier partner.',
    delivered: 'Your order has been delivered! We hope you enjoy the nourishment and pure wellness.',
  };

  const body = `
    <div style="text-align: center;">
      <span class="badge" style="text-transform: uppercase;">${newStatus.replace(/_/g, ' ')}</span>
      <h2 style="color: #163c0f; font-family: Georgia, serif; margin: 12px 0 6px 0;">Order Status Update</h2>
      <p style="color: #555; font-size: 15px; margin: 16px 0;">
        ${statusDescriptions[newStatus] || `Your order #${order.order_number} is now ${newStatus}.`}
      </p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thegutvaidya.com'}/account/orders" class="btn">
        Track Your Order
      </a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: `Update on your GutVaidya Order #${order.order_number}: ${newStatus.toUpperCase()}`,
      html: emailWrapper(body, `Your GutVaidya order #${order.order_number} status updated to ${newStatus}`),
    });
  } catch (e) {
    console.error('Status update email failed', e);
  }
}

export async function sendContactInquiryEmail(inquiry: { name: string; email: string; message: string }) {
  const adminTarget = adminEmail;
  const content = `
    <h2 style="color: #163c0f; font-family: Georgia, serif; margin-top: 0;">New Customer Message</h2>
    <p style="color: #444; font-size: 15px;">You have received a new customer message from the GutVaidya website contact form.</p>
    
    <div style="background: #f4f8f2; border: 1px solid #ccdbb6; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0;"><strong>Sender Name:</strong> ${inquiry.name}</p>
      <p style="margin: 0 0 10px 0;"><strong>Sender Email:</strong> <a href="mailto:${inquiry.email}" style="color: #163c0f; font-weight: bold;">${inquiry.email}</a></p>
      <p style="margin: 0 0 6px 0;"><strong>Message:</strong></p>
      <div style="background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #e6edd9; color: #1c241b; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${inquiry.message}</div>
    </div>

    <p style="font-size: 13px; color: #666;">
      To reply directly to this customer, reply to this email or send to <a href="mailto:${inquiry.email}">${inquiry.email}</a>.
    </p>
  `;

  if (!resend) {
    console.log(`[Email Simulation] Contact message from ${inquiry.name} (${inquiry.email}) sent to admin: ${adminTarget}`);
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: adminTarget,
      replyTo: inquiry.email,
      subject: `New Inquiry from ${inquiry.name} — GutVaidya Support`,
      html: emailWrapper(content, `New customer inquiry from ${inquiry.name}: ${inquiry.message.slice(0, 60)}`),
    });
  } catch (err) {
    console.error('Failed to send contact inquiry email:', err);
  }
}

