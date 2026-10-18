import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Lightweight health probe for uptime monitors (UptimeRobot, Better Stack, etc.).
// Checks that env is wired and the database is reachable. Returns 200 when healthy,
// 503 when a dependency is down so the monitor can page.
export async function GET() {
  const checks: Record<string, 'ok' | 'missing' | 'down'> = {
    supabase: 'missing',
    razorpay: process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? 'ok' : 'missing',
    resend: process.env.RESEND_API_KEY ? 'ok' : 'missing',
  };

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      // Cheapest possible query that still proves the DB is reachable with our key
      const { error } = await adminClient.from('products').select('id', { head: true, count: 'exact' }).limit(1);
      checks.supabase = error ? 'down' : 'ok';
    } catch {
      checks.supabase = 'down';
    }
  }

  const healthy = checks.supabase === 'ok' && checks.razorpay === 'ok';
  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      checks,
      time: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
