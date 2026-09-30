import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderStatus, getOrderByIdOrNumber } from '@/lib/orders';

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Unsigned events can't be trusted, so ignore them entirely
    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: 'Webhook signature missing' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const receipt = payment.notes?.order_number;

      if (receipt) {
        const order = await getOrderByIdOrNumber(receipt);
        if (order && order.payment_status !== 'paid') {
          await updateOrderStatus(order.id, 'confirmed');
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook processing error', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
