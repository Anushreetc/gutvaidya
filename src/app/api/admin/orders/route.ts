import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/orders';
import { requireAdminApi } from '@/lib/supabase/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const orders = await getOrders();
  return NextResponse.json({ live: isSupabaseConfigured(), orders });
}
