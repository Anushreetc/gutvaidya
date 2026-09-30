import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { markOrderPaid } from '@/lib/orders';
import { sendOrderConfirmationEmail } from '@/lib/email';

// Razorpay calls this after a payment succeeds. It is the safety net for customers who pay
// and then close the tab: their pending order is marked paid here, and the confirmation
// email goes out. If the browser already confirmed the payment, this is a no-op.
export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Unsigned events can't be trusted, so ignore them entirely
    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: 'Webhook signature missing' }, { status: 400 });
    }

    const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    const valid =
      expected.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!valid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id && payment?.id) {
        const result = await markOrderPaid({ razorpayOrderId: payment.order_id, razorpayPaymentId: payment.id });
        if (!result) {
          console.error('Webhook: payment for unknown order', payment.order_id, payment.id);
        } else if (result.justPaid) {
          console.log('Webhook recovered order', result.order.order_number);
          sendOrderConfirmationEmail(result.order).catch((err) => console.error('Webhook email error', err));
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook processing error', err);
    // A 5xx makes Razorpay retry later, which is what we want for transient database errors
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
