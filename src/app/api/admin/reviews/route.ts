import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminApi } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const adminClient = createAdminClient();
  if (!adminClient) return NextResponse.json({ live: false, reviews: [] });

  const { data, error } = await adminClient
    .from('reviews')
    .select('id, product_id, customer_name, rating, review, approved, verified_purchase, created_at, products(name)')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    live: true,
    reviews: data.map((r: any) => ({ ...r, product_name: r.products?.name, products: undefined })),
  });
}

// { action: 'approve' | 'hide' | 'delete', id }
export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const adminClient = createAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'Database not connected' }, { status: 400 });

  const { action, id } = await req.json();
  if (!/^[0-9a-f-]{36}$/i.test(String(id))) {
    return NextResponse.json({ error: 'Invalid review' }, { status: 400 });
  }

  const { error } =
    action === 'delete'
      ? await adminClient.from('reviews').delete().eq('id', id)
      : action === 'approve' || action === 'hide'
        ? await adminClient.from('reviews').update({ approved: action === 'approve' }).eq('id', id)
        : { error: { message: 'Invalid action' } };

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
