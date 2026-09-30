import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from './server';
import { createAdminClient } from './admin';
import { isSupabaseConfigured } from './config';

// Returns the signed-in Supabase user (verified with the Auth server), or null.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const adminClient = createAdminClient();
  if (!adminClient) return false;
  const { data } = await adminClient.from('profiles').select('role').eq('id', userId).single();
  return data?.role === 'admin';
}

// For API route handlers. Returns an error response when the caller is not an admin,
// or null when the request may proceed. Without Supabase configured the site runs in
// demo mode and admin routes stay open.
export async function requireAdminApi(): Promise<NextResponse | null> {
  if (!isSupabaseConfigured()) return null;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in as an administrator.' }, { status: 401 });
  }
  if (!(await isUserAdmin(user.id))) {
    return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  }
  return null;
}

// For server components under /admin.
export async function requireAdminPage(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const user = await getCurrentUser();
  if (!user) redirect('/auth/login?next=/admin');
  if (!(await isUserAdmin(user.id))) redirect('/');
}
