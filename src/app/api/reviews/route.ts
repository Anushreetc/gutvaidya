import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/supabase/auth';
import { rateLimit } from '@/lib/rate-limit';

// Customers submit a review; it stays hidden until an admin approves it.
export async function POST(req: Request) {
  const limited = await rateLimit(req, 'review', 5, 3600);
  if (limited) return limited;

  const adminClient = createAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Reviews are not available yet.' }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in to write a review.' }, { status: 401 });
  }

  try {
    const { productId, rating, review, name } = await req.json();
    const stars = Number(rating);
    const text = String(review || '').trim();
    const displayName = String(name || '').trim().slice(0, 80);

    if (!/^[0-9a-f-]{36}$/i.test(String(productId))) {
      return NextResponse.json({ error: 'Invalid product.' }, { status: 400 });
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Please choose a rating from 1 to 5 stars.' }, { status: 400 });
    }
    if (text.length < 10 || text.length > 2000) {
      return NextResponse.json({ error: 'Please write between 10 and 2000 characters.' }, { status: 400 });
    }

    // Verified Buyer = the reviewer has a paid order containing this product
    const { data: purchases } = await adminClient
      .from('order_items')
      .select('id, orders!inner(customer_id, payment_status)')
      .eq('product_id', productId)
      .eq('orders.customer_id', user.id)
      .eq('orders.payment_status', 'paid')
      .limit(1);

    const { data: profile } = await adminClient.from('profiles').select('name').eq('id', user.id).single();

    const { error } = await adminClient.from('reviews').insert({
      product_id: productId,
      customer_id: user.id,
      customer_name: displayName || profile?.name || (user.email || 'Customer').split('@')[0],
      rating: stars,
      review: text,
      approved: false,
      verified_purchase: (purchases?.length || 0) > 0,
    });
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Review submit error', err);
    return NextResponse.json({ error: 'Could not submit your review. Please try again.' }, { status: 500 });
  }
}
