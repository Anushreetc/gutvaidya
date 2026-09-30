import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SEED_COUPONS } from '@/lib/coupons';
import { requireAdminApi } from '@/lib/supabase/auth';

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const adminClient = createAdminClient();
  if (!adminClient) {
    return NextResponse.json({ live: false, coupons: SEED_COUPONS });
  }

  const { data, error } = await adminClient.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ live: true, coupons: data });
}

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { action, coupon } = body;

    const adminClient = createAdminClient();

    if (action === 'create') {
      const newCoupon = {
        code: coupon.code.toUpperCase().trim(),
        discount_type: coupon.discount_type,
        discount_value: Number(coupon.discount_value),
        minimum_order_value: Number(coupon.minimum_order_value) || 0,
        maximum_discount: Number(coupon.maximum_discount) || null,
        usage_limit: Number(coupon.usage_limit) || null,
        active: true,
      };

      if (adminClient) {
        const { data, error } = await adminClient
          .from('coupons')
          .insert(newCoupon)
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, coupon: data });
        }
      }

      const memoryCoupon = {
        ...newCoupon,
        id: `c-${Date.now()}`,
        used_count: 0,
      };
      SEED_COUPONS.push(memoryCoupon as any);
      return NextResponse.json({ success: true, coupon: memoryCoupon });
    }

    if (action === 'toggle') {
      if (adminClient) {
        await adminClient
          .from('coupons')
          .update({ active: coupon.active })
          .eq('id', coupon.id);
        return NextResponse.json({ success: true });
      }

      const found = SEED_COUPONS.find((c) => c.id === coupon.id || c.code === coupon.code);
      if (found) {
        found.active = coupon.active;
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin coupon error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
