import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Landing point for links in Supabase auth emails (sign-up confirmation, password reset).
// Handles both the default ?code= links and ?token_hash=&type= links, signs the user in,
// then sends them on to ?next= (same-site paths only).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const nextParam = searchParams.get('next') || '/account';
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/account';

  const supabase = await createClient();
  if (supabase) {
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : tokenHash && type
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        : { error: new Error('Missing code') };

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('Auth callback failed', error.message);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=link_invalid`);
}
