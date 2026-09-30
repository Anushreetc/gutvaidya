-- =========================================================
-- Security Advisor fixes (run once in the Supabase SQL Editor). Safe to re-run.
-- 1. Moves is_admin() out of the public API into a private schema
-- 2. Stops the public API from calling the two trigger functions directly
-- Runs as one transaction: if anything fails, nothing changes.
-- =========================================================
begin;

create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql stable security definer set search_path = public;

-- Security rules are evaluated as the visitor, so they need to be able to run it
revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

create or replace function public.protect_profile_role()
returns trigger as $$
begin
  if new.role is distinct from old.role
     and coalesce(auth.role(), '') in ('authenticated', 'anon')
     and not private.is_admin() then
    raise exception 'Only administrators can change user roles';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Point every security rule at the private copy
drop policy if exists "Admin manage categories" on public.categories;
create policy "Admin manage categories" on public.categories for all using (private.is_admin());

drop policy if exists "Active products are viewable by everyone" on public.products;
create policy "Active products are viewable by everyone" on public.products for select using (status = 'active' or private.is_admin());

drop policy if exists "Admin manage products" on public.products;
create policy "Admin manage products" on public.products for all using (private.is_admin());

drop policy if exists "Admin manage product images" on public.product_images;
create policy "Admin manage product images" on public.product_images for all using (private.is_admin());

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id or private.is_admin());

drop policy if exists "Users manage own addresses" on public.addresses;
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = customer_id or private.is_admin());

drop policy if exists "Active coupons viewable by anyone" on public.coupons;
create policy "Active coupons viewable by anyone" on public.coupons for select using (active = true or private.is_admin());

drop policy if exists "Admin manage coupons" on public.coupons;
create policy "Admin manage coupons" on public.coupons for all using (private.is_admin());

drop policy if exists "Users view own orders" on public.orders;
create policy "Users view own orders" on public.orders for select using (auth.uid() = customer_id or private.is_admin());

drop policy if exists "Admin manage orders" on public.orders;
create policy "Admin manage orders" on public.orders for all using (private.is_admin());

drop policy if exists "Users view own order items" on public.order_items;
create policy "Users view own order items" on public.order_items for select using (
    exists (
        select 1 from public.orders
        where orders.id = order_items.order_id
        and (orders.customer_id = auth.uid() or private.is_admin())
    )
);

drop policy if exists "Approved reviews viewable by everyone" on public.reviews;
create policy "Approved reviews viewable by everyone" on public.reviews for select using (approved = true or private.is_admin());

drop policy if exists "Admin manage reviews" on public.reviews;
create policy "Admin manage reviews" on public.reviews for all using (private.is_admin());

drop policy if exists "Admin manage contact messages" on public.contact_messages;
create policy "Admin manage contact messages" on public.contact_messages for all using (private.is_admin());

-- Nothing uses the public copy any more
drop function if exists public.is_admin();

-- Trigger functions only run from their triggers, never from the API
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protect_profile_role() from public, anon, authenticated;

commit;
