import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateLiveProduct, createLiveProduct } from '@/lib/products-server';
import { safeDecodeCookie } from '@/lib/products-client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { requireAdminApi } from '@/lib/supabase/auth';
import { Product } from '@/types/ecommerce';

export const dynamic = 'force-dynamic';

function revalidateStorefront(slug?: string) {
  try {
    revalidatePath('/');
    revalidatePath('/products');
    if (slug) revalidatePath(`/products/${slug}`);
    revalidatePath('/admin/products');
  } catch (e) {}
}

function toOverride(product: Product) {
  return {
    price: Number(product.price),
    compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
    stock_quantity: Number(product.stock_quantity),
    status: product.status,
    featured: product.featured,
  };
}

// Demo mode (no database): admin edits are also mirrored into a cookie so they survive
// across serverless instances. With Supabase connected the database is the only source.
function withDemoCookie(req: Request, res: NextResponse, product: Product) {
  if (isSupabaseConfigured()) return res;

  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/gutvaidya_custom_products=([^;]+)/);
  const overrides: Record<string, any> = match?.[1] ? safeDecodeCookie(match[1]) : {};

  overrides[product.id] = toOverride(product);
  if (product.slug) overrides[product.slug] = overrides[product.id];

  res.cookies.set('gutvaidya_custom_products', encodeURIComponent(JSON.stringify(overrides)), {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  });
  return res;
}

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { action, product } = body;

    if (action === 'update' && product?.id) {
      const updated = await updateLiveProduct(product);
      revalidateStorefront(product.slug);
      return withDemoCookie(req, NextResponse.json({ success: true, product: updated }), updated);
    }

    if (action === 'create' && product) {
      const created = await createLiveProduct(product);
      revalidateStorefront(created.slug);
      return withDemoCookie(req, NextResponse.json({ success: true, product: created }), created);
    }

    return NextResponse.json({ error: 'Invalid action or missing product' }, { status: 400 });
  } catch (err: any) {
    console.error('Admin product error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
