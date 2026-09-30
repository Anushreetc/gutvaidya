import { NextResponse } from 'next/server';
import { createAdminClient } from './supabase/admin';

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

// Counts this request against a per-IP limit stored in Supabase. Returns a 429 response
// when the limit is exceeded, or null to continue. Fails open (allows the request) if the
// database is unavailable, so a rate-limit outage never blocks real customers.
export async function rateLimit(
  req: Request,
  name: string,
  limit: number,
  windowSeconds: number
): Promise<NextResponse | null> {
  const adminClient = createAdminClient();
  if (!adminClient) return null;

  const { data: allowed, error } = await adminClient.rpc('hit_rate_limit', {
    p_key: `${name}:${getClientIp(req)}`,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error('Rate limit check failed', name, error.message);
    return null;
  }

  if (allowed === false) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(windowSeconds) } }
    );
  }
  return null;
}
