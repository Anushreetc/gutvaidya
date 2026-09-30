import { Order, OrderStatus } from '@/types/ecommerce';
import { createAdminClient } from './supabase/admin';

// In-memory fallback order store for dev preview when Supabase is not connected
let memoryOrders: Order[] = [
  {
    id: 'ord-seed-001',
    order_number: 'GV-849201',
    customer_id: 'demo-customer-id',
    customer_name: 'Priya Sharma',
    customer_email: 'priya.sharma@example.com',
    customer_phone: '+91 98765 43210',
    shipping_address: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      address_line_1: '402, Green Lotus Apartments, Indiranagar',
      address_line_2: '100 Feet Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560038',
      country: 'India',
    },
    subtotal: 1698,
    discount: 100,
    shipping_charge: 0,
    tax: 0,
    total: 1598,
    payment_status: 'paid',
    order_status: 'delivered',
    razorpay_order_id: 'order_test_849201',
    razorpay_payment_id: 'pay_test_849201',
    coupon_code: 'FESTIVE100',
    items: [
      {
        product_id: 'a1111111-1111-1111-1111-111111111111',
        product_name: 'GutVaidya Health Mix',
        quantity: 1,
        unit_price: 799,
        total_price: 799,
        image: '/product.jpeg',
      },
      {
        product_id: 'a2222222-2222-2222-2222-222222222222',
        product_name: 'GutVaidya Baal Vit',
        quantity: 1,
        unit_price: 899,
        total_price: 899,
        image: '/product.jpeg',
      },
    ],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;

// Inserts the order row and its line items. Stock and coupons are not touched here.
async function insertOrderRows(adminClient: AdminClient, orderData: Omit<Order, 'id'>) {
  const { data: orderRow, error: orderErr } = await adminClient
    .from('orders')
    .insert({
      order_number: orderData.order_number,
      customer_id: orderData.customer_id || null,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      shipping_address: orderData.shipping_address,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping_charge: orderData.shipping_charge,
      tax: orderData.tax,
      total: orderData.total,
      payment_status: orderData.payment_status,
      order_status: orderData.order_status,
      razorpay_order_id: orderData.razorpay_order_id,
      razorpay_payment_id: orderData.razorpay_payment_id,
      razorpay_signature: orderData.razorpay_signature,
      coupon_code: orderData.coupon_code,
      notes: orderData.notes,
    })
    .select()
    .single();
  if (orderErr) throw orderErr;

  const { error: itemsErr } = await adminClient.from('order_items').insert(
    orderData.items.map((item) => ({
      order_id: orderRow.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      image: item.image,
    }))
  );
  if (itemsErr) {
    // An order without items is useless; remove it so the error surfaces cleanly
    await adminClient.from('orders').delete().eq('id', orderRow.id);
    throw itemsErr;
  }

  return orderRow;
}

// Runs once per order, when it becomes paid
async function applyPaidSideEffects(adminClient: AdminClient, order: Order) {
  for (const item of order.items) {
    const { error } = await adminClient.rpc('decrement_product_stock', {
      p_id: item.product_id,
      p_qty: item.quantity,
    });
    if (error) console.error('Stock decrement failed', item.product_id, error);
  }

  if (order.coupon_code) {
    const { error } = await adminClient.rpc('increment_coupon_usage', { p_code: order.coupon_code });
    if (error) console.error('Coupon usage increment failed', order.coupon_code, error);
  }
}

// Saves the order before the customer pays, so a payment can never arrive for an order we
// don't have. It becomes a real order only when markOrderPaid runs.
export async function createPendingOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
  const adminClient = createAdminClient();
  if (!adminClient) throw new Error('Pending orders need the database');

  const row = await insertOrderRows(adminClient, {
    ...orderData,
    payment_status: 'pending',
    order_status: 'pending',
  });
  return { ...orderData, id: row.id, payment_status: 'pending', order_status: 'pending' };
}

// Marks the pending order for a Razorpay order as paid. Safe to call from both the browser
// callback and the webhook: the conditional update lets exactly one caller win, and only
// that caller decrements stock and sends emails (justPaid = true).
export async function markOrderPaid(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
}): Promise<{ order: Order; justPaid: boolean } | null> {
  const adminClient = createAdminClient();
  if (!adminClient) return null;

  const { data: updated, error } = await adminClient
    .from('orders')
    .update({
      payment_status: 'paid',
      order_status: 'confirmed',
      razorpay_payment_id: params.razorpayPaymentId,
      ...(params.razorpaySignature ? { razorpay_signature: params.razorpaySignature } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('razorpay_order_id', params.razorpayOrderId)
    .eq('payment_status', 'pending')
    .select('*, order_items (*)');
  if (error) throw error;

  if (updated && updated.length > 0) {
    const order = { ...updated[0], items: updated[0].order_items || [] } as Order;
    await applyPaidSideEffects(adminClient, order);
    return { order, justPaid: true };
  }

  // Already marked paid by the other caller (or no such order)
  const { data: existing } = await adminClient
    .from('orders')
    .select('*, order_items (*)')
    .eq('razorpay_order_id', params.razorpayOrderId)
    .maybeSingle();
  if (!existing) return null;
  return { order: { ...existing, items: existing.order_items || [] } as Order, justPaid: false };
}

// Demo mode (no database): keep orders in memory
export async function createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
  };
  memoryOrders.unshift(newOrder);
  return newOrder;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getOrders(options?: {
  customerId?: string;
  email?: string;
  status?: string;
  paidOnly?: boolean;
}): Promise<Order[]> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      let query = adminClient
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (options?.customerId && options?.email) {
        // Include guest orders placed with the same email before the account existed
        query = query.or(`customer_id.eq.${options.customerId},customer_email.eq."${options.email}"`);
      } else if (options?.customerId) {
        query = query.eq('customer_id', options.customerId);
      } else if (options?.email) {
        query = query.eq('customer_email', options.email);
      }

      if (options?.status) {
        query = query.eq('order_status', options.status);
      }

      if (options?.paidOnly) {
        query = query.eq('payment_status', 'paid');
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((row: any) => ({
          ...row,
          items: row.order_items || [],
        })) as Order[];
      }
    } catch (e) {
      console.warn('Database orders query failed, using memory fallback', e);
    }
  }

  let results = [...memoryOrders];
  if (options?.customerId && options?.email) {
    results = results.filter(
      (o) => o.customer_id === options.customerId || o.customer_email.toLowerCase() === options.email?.toLowerCase()
    );
  } else if (options?.customerId) {
    results = results.filter((o) => o.customer_id === options.customerId);
  } else if (options?.email) {
    results = results.filter((o) => o.customer_email.toLowerCase() === options.email?.toLowerCase());
  }

  if (options?.status) {
    results = results.filter((o) => o.order_status === options.status);
  }

  return results;
}

export async function getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq(UUID_RE.test(idOrNumber) ? 'id' : 'order_number', idOrNumber)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          items: data.order_items || [],
        } as Order;
      }
    } catch (e) {
      console.warn('DB get order failed', e);
    }
  }

  return memoryOrders.find((o) => o.id === idOrNumber || o.order_number === idOrNumber) || null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      const { error } = await adminClient
        .from('orders')
        .update({ order_status: status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (!error) return true;
    } catch (e) {
      console.warn('DB update order status failed', e);
    }
  }

  const order = memoryOrders.find((o) => o.id === orderId || o.order_number === orderId);
  if (order) {
    order.order_status = status;
    return true;
  }

  return false;
}
