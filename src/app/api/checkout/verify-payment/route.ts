import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { createOrder, markOrderPaid } from '@/lib/orders';
import { getProducts } from '@/lib/products';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { rateLimit } from '@/lib/rate-limit';
import { Order } from '@/types/ecommerce';

export async function POST(req: Request) {
  const limited = await rateLimit(req, 'verify-payment', 30, 600);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    // 1. Mandatory server-side cryptographic signature verification
    if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      console.error('Cryptographic signature verification failed', { razorpayOrderId, razorpayPaymentId });
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Untrusted payment.' },
        { status: 400 }
      );
    }

    // 2. Database mode: the order was saved as pending at checkout; mark it paid.
    //    The Razorpay webhook does the same thing if this request never arrives.
    if (isSupabaseConfigured()) {
      const result = await markOrderPaid({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
      if (!result) {
        console.error('Paid Razorpay order has no matching pending order', razorpayOrderId);
        return NextResponse.json(
          { success: false, error: 'We received your payment but could not find your order. Please contact support with your payment ID.' },
          { status: 404 }
        );
      }

      if (result.justPaid) {
        sendOrderConfirmationEmail(result.order).catch((err) => console.error('Background order email error', err));
      }

      return NextResponse.json({ success: true, orderId: result.order.id, orderNumber: result.order.order_number });
    }

    // 3. Demo mode (no database): build the order from the request and keep it in memory
    const { orderNumber, customerInfo, shippingAddress, items, breakdown, couponCode, notes } = body;
    const catalogue = await getProducts();
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
      items: (items as any[]).map((i) => {
        const product = catalogue.find((p) => p.id === i.id || p.slug === i.slug || p.name === i.name);
        const quantity = Math.max(1, Number(i.qty) || 1);
        const unitPrice = product ? product.price : Number(i.price);
        return {
          product_id: product ? product.id : i.id,
          product_name: product ? product.name : i.name,
          quantity,
          unit_price: unitPrice,
          total_price: unitPrice * quantity,
          image: product?.main_image || i.image,
        };
      }),
      created_at: new Date().toISOString(),
    };

    const savedOrder = await createOrder(orderData);
    sendOrderConfirmationEmail(savedOrder).catch((err) => console.error('Background order email error', err));

    return NextResponse.json({ success: true, orderId: savedOrder.id, orderNumber: savedOrder.order_number });
  } catch (err: any) {
    console.error('Payment verification route error', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
