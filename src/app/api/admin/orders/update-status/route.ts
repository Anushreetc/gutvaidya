import { NextResponse } from 'next/server';
import { updateOrderStatus, getOrderByIdOrNumber } from '@/lib/orders';
import { sendOrderStatusUpdateEmail } from '@/lib/email';
import { OrderStatus } from '@/types/ecommerce';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and new status are required.' },
        { status: 400 }
      );
    }

    const validStatuses: OrderStatus[] = [
      'pending',
      'confirmed',
      'processing',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status as OrderStatus);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Send email notification to customer
    const order = await getOrderByIdOrNumber(orderId);
    if (order) {
      sendOrderStatusUpdateEmail(order, status).catch((e) =>
        console.error('Failed to send status update email', e)
      );
    }

    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    console.error('Admin update order error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
