import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/orders';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminApi } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';

// Registered profiles merged with guest checkouts, keyed by email.
export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const adminClient = createAdminClient();
  if (!adminClient) {
    return NextResponse.json({ live: false, customers: [] });
  }

  const [{ data: profiles, error }, orders] = await Promise.all([
    adminClient.from('profiles').select('id, name, email, phone, created_at').eq('role', 'customer'),
    getOrders(),
  ]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const byEmail = new Map<string, any>();
  for (const p of profiles || []) {
    if (!p.email) continue;
    byEmail.set(p.email.toLowerCase(), {
      id: p.id,
      name: p.name || p.email.split('@')[0],
      email: p.email,
      phone: p.phone || '',
      ordersCount: 0,
      totalSpent: 0,
      joinedDate: p.created_at,
    });
  }

  for (const o of orders) {
    if (o.payment_status !== 'paid') continue;
    const key = o.customer_email.toLowerCase();
    const c =
      byEmail.get(key) ||
      {
        id: `guest-${key}`,
        name: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone,
        ordersCount: 0,
        totalSpent: 0,
        joinedDate: o.created_at,
      };
    c.ordersCount += 1;
    c.totalSpent += Number(o.total) || 0;
    if (!c.phone) c.phone = o.customer_phone;
    if (new Date(o.created_at) < new Date(c.joinedDate)) c.joinedDate = o.created_at;
    byEmail.set(key, c);
  }

  const customers = [...byEmail.values()]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .map((c) => ({
      ...c,
      joinedDate: new Date(c.joinedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    }));

  return NextResponse.json({ live: true, customers });
}
