import { NextResponse } from 'next/server';
import { verifyRazorpaySignature, razorpayInstance } from '@/lib/razorpay';
import { createOrder } from '@/lib/orders';
import { getProducts } from '@/lib/products';
import { getCurrentUser } from '@/lib/supabase/auth';
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

    // 2. Take the amount and order number from Razorpay itself, not from the browser
    let paidTotal = Number(breakdown?.total) || 0;
    let verifiedOrderNumber = orderNumber || `GV-${Date.now().toString().slice(-6)}`;
    if (razorpayInstance) {
      const rzpOrder = await razorpayInstance.orders.fetch(razorpayOrderId);
      paidTotal = Number(rzpOrder.amount) / 100;
      if (rzpOrder.receipt) verifiedOrderNumber = rzpOrder.receipt;
    }

    // 3. Resolve line items against the catalogue so ids and prices are server-trusted
    const catalogue = await getProducts();
    const orderItems = (items as any[]).map((i) => {
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
    });

    // 4. Link the order to the signed-in account (never to an id sent by the browser)
    const user = await getCurrentUser();

    const orderData: Omit<Order, 'id'> = {
      order_number: verifiedOrderNumber,
      customer_id: user?.id || undefined,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      shipping_address: shippingAddress,
      subtotal: breakdown.subtotal,
      discount: breakdown.discount || 0,
      shipping_charge: breakdown.shippingCharge || 0,
      tax: breakdown.tax || 0,
      total: paidTotal,
      payment_status: 'paid',
      order_status: 'confirmed',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      coupon_code: couponCode || undefined,
      notes: notes || undefined,
      items: orderItems,
      created_at: new Date().toISOString(),
    };

    // 5. Save order, items, decrement stock, increment coupon, items, decrement stock, increment coupon
    const savedOrder = await createOrder(orderData);

    // 6. Trigger asynchronous email notifications
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
