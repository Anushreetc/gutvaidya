-- =========================================================
-- Launch fixes (run once in the Supabase SQL Editor). Safe to re-run.
-- Already included in schema.sql for fresh installs.
-- =========================================================

-- 1. One order per Razorpay order: orders are now saved as "pending" before payment,
--    and both the browser and the webhook mark the same row paid.
create unique index if not exists idx_orders_razorpay_order_id
    on public.orders(razorpay_order_id) where razorpay_order_id is not null;

-- 2. Rate limiting for public endpoints (contact form, checkout, coupons, reviews)
create table if not exists public.rate_limits (
    key text primary key,
    window_start timestamp with time zone not null default now(),
    count integer not null default 0
);

-- No policies: only the server (service role) can touch this table
alter table public.rate_limits enable row level security;

-- Counts one request for p_key; returns false once p_limit is exceeded within the window
create or replace function public.hit_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean as $$
declare
  v_count integer;
begin
  insert into public.rate_limits as r (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update set
    count = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.count + 1 end,
    window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end
  returning count into v_count;

  -- Occasionally clear out stale entries
  if random() < 0.01 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_count <= p_limit;
end;
$$ language plpgsql security definer set search_path = public;

revoke execute on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;

-- 3. Reviews are moderated: new reviews start unapproved (the insert policy already requires it)
alter table public.reviews alter column approved set default false;

-- 4. Reviews record whether the reviewer actually bought the product (checked server-side)
alter table public.reviews add column if not exists verified_purchase boolean not null default false;
