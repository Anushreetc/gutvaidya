// True when the public Supabase keys are present. NEXT_PUBLIC_* vars are inlined
// at build time, so this works identically on the server and in the browser.
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
