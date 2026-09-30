-- =========================================================
-- Gut Vaidya E-Commerce PostgreSQL Database Schema (Supabase)
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    image text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    short_description text,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
    sku text unique,
    stock_quantity integer not null default 0 check (stock_quantity >= 0),
    category_id uuid references public.categories(id) on delete set null,
    main_image text not null,
    status text not null default 'active' check (status in ('active', 'draft', 'archived')),
    featured boolean not null default false,
    benefits jsonb default '[]'::jsonb,
    ingredients text,
    usage_instructions text,
    weight_size text default '500g',
    badge text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for product lookups
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_status_featured on public.products(status, featured);

-- 3. PRODUCT IMAGES (Additional Gallery Images)
create table if not exists public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    image_url text not null,
    alt_text text,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_product_images_product on public.product_images(product_id, sort_order);

-- 4. USER PROFILES TABLE (Linked with Supabase Auth)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text,
    email text unique,
    phone text,
    role text not null default 'customer' check (role in ('customer', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to create profile upon new Supabase user signup.
-- Role is always 'customer': sign-up metadata is client-controlled and must never grant admin.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. ADDRESSES TABLE
create table if not exists public.addresses (
    id uuid primary key default gen_random_uuid(),
    customer_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    phone text not null,
    address_line_1 text not null,
    address_line_2 text,
    city text not null,
    state text not null,
    postal_code text not null,
    country text not null default 'India',
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_addresses_customer on public.addresses(customer_id);

-- 6. COUPONS TABLE
create table if not exists public.coupons (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    discount_type text not null check (discount_type in ('percentage', 'fixed')),
    discount_value numeric(10, 2) not null check (discount_value > 0),
    minimum_order_value numeric(10, 2) default 0,
    maximum_discount numeric(10, 2),
    usage_limit integer,
    used_count integer not null default 0,
    start_date timestamp with time zone default timezone('utc'::text, now()),
    expiry_date timestamp with time zone,
    active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ORDERS TABLE
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique,
    customer_id uuid references public.profiles(id) on delete set null,
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    shipping_address jsonb not null,
    subtotal numeric(10, 2) not null,
    discount numeric(10, 2) not null default 0,
    shipping_charge numeric(10, 2) not null default 0,
    tax numeric(10, 2) not null default 0,
    total numeric(10, 2) not null,
    payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
    order_status text not null default 'pending' check (order_status in ('pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
    razorpay_order_id text,
    razorpay_payment_id text,
    razorpay_signature text,
    coupon_code text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- 8. ORDER ITEMS TABLE (Snapshot of product data)
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric(10, 2) not null check (unit_price >= 0),
    total_price numeric(10, 2) not null check (total_price >= 0),
    image text
);

create index if not exists idx_order_items_order on public.order_items(order_id);

-- 9. REVIEWS TABLE
create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    customer_id uuid references public.profiles(id) on delete set null,
    customer_name text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    review text not null,
    approved boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_reviews_product on public.reviews(product_id);

-- 10. CONTACT MESSAGES (Website contact form)
create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    message text not null,
    status text not null default 'unread' check (status in ('unread', 'read', 'replied')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql stable security definer set search_path = public;

-- Stop signed-in users from promoting themselves via the "update own profile" policy.
-- Service-role (server) and SQL-editor updates are allowed.
create or replace function public.protect_profile_role()
returns trigger as $$
begin
  if new.role is distinct from old.role
     and coalesce(auth.role(), '') in ('authenticated', 'anon')
     and not public.is_admin() then
    raise exception 'Only administrators can change user roles';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before update on public.profiles
  for each row execute procedure public.protect_profile_role();

-- Categories: Anyone can read, only admin can insert/update/delete
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone" on public.categories for select using (true);
drop policy if exists "Admin manage categories" on public.categories;
create policy "Admin manage categories" on public.categories for all using (public.is_admin());

-- Products: Active products viewable by everyone; Admin can view and manage all
drop policy if exists "Active products are viewable by everyone" on public.products;
create policy "Active products are viewable by everyone" on public.products for select using (status = 'active' or public.is_admin());
drop policy if exists "Admin manage products" on public.products;
create policy "Admin manage products" on public.products for all using (public.is_admin());

-- Product images: Viewable by everyone; Admin can manage
drop policy if exists "Product images viewable by everyone" on public.product_images;
create policy "Product images viewable by everyone" on public.product_images for select using (true);
drop policy if exists "Admin manage product images" on public.product_images;
create policy "Admin manage product images" on public.product_images for all using (public.is_admin());

-- Profiles: Users can read and update their own profile; Admin can read all
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Addresses: Users can manage their own addresses
drop policy if exists "Users manage own addresses" on public.addresses;
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = customer_id or public.is_admin());

-- Coupons: Active coupons readable by authenticated/anon for validation; Admin can manage
drop policy if exists "Active coupons viewable by anyone" on public.coupons;
create policy "Active coupons viewable by anyone" on public.coupons for select using (active = true or public.is_admin());
drop policy if exists "Admin manage coupons" on public.coupons;
create policy "Admin manage coupons" on public.coupons for all using (public.is_admin());

-- Orders: Users can read their own orders; Admin can read and update all
drop policy if exists "Users view own orders" on public.orders;
create policy "Users view own orders" on public.orders for select using (auth.uid() = customer_id or public.is_admin());
drop policy if exists "Admin manage orders" on public.orders;
create policy "Admin manage orders" on public.orders for all using (public.is_admin());

-- Order items: Viewable if user can view parent order
drop policy if exists "Users view own order items" on public.order_items;
create policy "Users view own order items" on public.order_items for select using (
    exists (
        select 1 from public.orders
        where orders.id = order_items.order_id
        and (orders.customer_id = auth.uid() or public.is_admin())
    )
);

-- Reviews: Approved reviews viewable by everyone; Users can insert review; Admin can manage
drop policy if exists "Approved reviews viewable by everyone" on public.reviews;
create policy "Approved reviews viewable by everyone" on public.reviews for select using (approved = true or public.is_admin());
drop policy if exists "Users can submit reviews" on public.reviews;
create policy "Users can submit reviews" on public.reviews for insert with check (auth.uid() is not null and customer_id = auth.uid() and approved = false);
drop policy if exists "Admin manage reviews" on public.reviews;
create policy "Admin manage reviews" on public.reviews for all using (public.is_admin());

-- Contact messages: only admins can read/manage (inserts happen server-side with the service role)
drop policy if exists "Admin manage contact messages" on public.contact_messages;
create policy "Admin manage contact messages" on public.contact_messages for all using (public.is_admin());

-- =========================================================
-- SERVER-SIDE FUNCTIONS (called with the service role only)
-- =========================================================

-- Atomic stock decrement used after a verified payment
create or replace function public.decrement_product_stock(p_id uuid, p_qty integer)
returns void as $$
  update public.products
  set stock_quantity = greatest(0, stock_quantity - p_qty),
      updated_at = timezone('utc'::text, now())
  where id = p_id;
$$ language sql security definer set search_path = public;

-- Atomic coupon usage increment
create or replace function public.increment_coupon_usage(p_code text)
returns void as $$
  update public.coupons set used_count = used_count + 1 where code = upper(p_code);
$$ language sql security definer set search_path = public;

revoke execute on function public.decrement_product_stock(uuid, integer) from public, anon, authenticated;
revoke execute on function public.increment_coupon_usage(text) from public, anon, authenticated;

-- =========================================================
-- REALTIME: push product price/stock changes to open browsers
-- =========================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
end $$;
