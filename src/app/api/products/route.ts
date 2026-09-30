import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLiveProducts, updateLiveProduct } from '@/lib/products-server';
import { safeDecodeCookie } from '@/lib/products-client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { requireAdminApi } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    let products = await getLiveProducts();

    // Demo mode only: apply admin edits stored in the cookie
    if (!isSupabaseConfigured()) try {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/gutvaidya_custom_products=([^;]+)/);
      if (match && match[1]) {
        const overrides = safeDecodeCookie(match[1]);
        products = products.map((p) => {
          const override = overrides[p.id] || overrides[p.slug];
          if (!override) return p;
          return {
            ...p,
            ...(override.price !== undefined ? { price: Number(override.price) } : {}),
            ...(override.compare_at_price !== undefined ? { compare_at_price: Number(override.compare_at_price) } : {}),
            ...(override.stock_quantity !== undefined ? { stock_quantity: Number(override.stock_quantity) } : {}),
            ...(override.status !== undefined ? { status: override.status } : {}),
            ...(override.featured !== undefined ? { featured: override.featured } : {}),
          };
        });
      }
    } catch (e) {}

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { action, product } = body;

    if (action === 'update' && product?.id) {
      const updated = await updateLiveProduct(product);

      // Revalidate routes
      try {
        revalidatePath('/');
        revalidatePath('/products');
        revalidatePath(`/products/${product.slug}`);
        revalidatePath('/admin/products');
      } catch (err) {
        // Safe ignore
      }

      return NextResponse.json({ success: true, product: updated });
    }

    return NextResponse.json({ error: 'Invalid action or missing product id' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}
