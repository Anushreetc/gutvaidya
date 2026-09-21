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
        product_id: 'p1111111-1111-1111-1111-111111111111',
        product_name: 'GutVaidya Health Mix',
        quantity: 1,
        unit_price: 799,
        total_price: 799,
        image: '/product.jpeg',
      },
      {
        product_id: 'p2222222-2222-2222-2222-222222222222',
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

export async function createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      // 1. Insert Order
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

      if (!orderErr && orderRow) {
        // 2. Insert Order Items
        const itemsToInsert = orderData.items.map((item) => ({
          order_id: orderRow.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          image: item.image,
        }));

        await adminClient.from('order_items').insert(itemsToInsert);

        // 3. Decrement Inventory
        for (const item of orderData.items) {
          try {
            await adminClient.rpc('decrement_product_stock', {
              p_id: item.product_id,
              p_qty: item.quantity,
            });
          } catch (e) {
            // Fallback manual stock update
            const { data: prod } = await adminClient
              .from('products')
              .select('stock_quantity')
              .eq('id', item.product_id)
              .single();
            if (prod) {
              await adminClient
                .from('products')
                .update({ stock_quantity: Math.max(0, prod.stock_quantity - item.quantity) })
                .eq('id', item.product_id);
            }
          }
        }

        // 4. Increment coupon usage
        if (orderData.coupon_code) {
          const { data: c } = await adminClient
            .from('coupons')
            .select('used_count')
            .eq('code', orderData.coupon_code)
            .single();
          if (c) {
            await adminClient
              .from('coupons')
              .update({ used_count: (c.used_count || 0) + 1 })
              .eq('code', orderData.coupon_code);
          }
        }

        return {
          ...orderData,
          id: orderRow.id,
        };
      }
    } catch (e) {
      console.warn('Database order insert failed, using fallback store', e);
    }
  }

  // Fallback in-memory order creation
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
  };
  memoryOrders.unshift(newOrder);
  return newOrder;
}

export async function getOrders(options?: {
  customerId?: string;
  email?: string;
  status?: string;
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

      if (options?.customerId) {
        query = query.eq('customer_id', options.customerId);
      } else if (options?.email) {
        query = query.eq('customer_email', options.email);
      }

      if (options?.status) {
        query = query.eq('order_status', options.status);
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
  if (options?.customerId) {
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
        .or(`id.eq.${idOrNumber},order_number.eq.${idOrNumber}`)
        .single();

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
