import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { createOrder } from '@/lib/orders';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { Order } from '@/types/ecommerce';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderNumber,
      customerInfo,
      shippingAddress,
      items,
      breakdown,
      couponCode,
      notes,
    } = body;

    // 1. Mandatory server-side cryptographic signature verification
    const isValidSignature = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      console.error('Cryptographic signature verification failed', {
        razorpayOrderId,
        razorpayPaymentId,
      });
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Untrusted payment.' },
        { status: 400 }
      );
    }

    // 2. Build verified order record
    const orderData: Omit<Order, 'id'> = {
      order_number: orderNumber || `GV-${Date.now().toString().slice(-6)}`,
      customer_id: customerInfo?.id || undefined,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      shipping_address: shippingAddress,
      subtotal: breakdown.subtotal,
      discount: breakdown.discount || 0,
      shipping_charge: breakdown.shippingCharge || 0,
      tax: breakdown.tax || 0,
      total: breakdown.total,
      payment_status: 'paid',
      order_status: 'confirmed',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      coupon_code: couponCode || undefined,
      notes: notes || undefined,
      items: items.map((i: any) => ({
        product_id: i.id,
        product_name: i.name,
        quantity: i.qty,
        unit_price: i.price,
        total_price: i.price * i.qty,
        image: i.image,
      })),
      created_at: new Date().toISOString(),
    };

    // 3. Atomically save order, items, decrement stock, increment coupon
    const savedOrder = await createOrder(orderData);

    // 4. Trigger asynchronous email notifications
    sendOrderConfirmationEmail(savedOrder).catch((err) =>
      console.error('Background order email error', err)
    );

    return NextResponse.json({
      success: true,
      orderId: savedOrder.id,
      orderNumber: savedOrder.order_number,
    });
  } catch (err: any) {
    console.error('Payment verification route error', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
