import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateLiveProduct, saveLocalStoredProducts, getLocalStoredProducts } from '@/lib/products-server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, product } = body;

    // Read current overrides cookie if present
    const cookieHeader = req.headers.get('cookie') || '';
    let overrides: Record<string, any> = {};
    const match = cookieHeader.match(/gutvaidya_custom_products=([^;]+)/);
    if (match && match[1]) {
      try {
        overrides = JSON.parse(decodeURIComponent(match[1]));
      } catch (e) {}
    }

    if (action === 'update' && product) {
      const updated = await updateLiveProduct(product);

      overrides[product.id] = {
        price: Number(product.price),
        compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
        stock_quantity: Number(product.stock_quantity),
        status: product.status,
        featured: product.featured,
      };
      if (product.slug) {
        overrides[product.slug] = overrides[product.id];
      }

      try {
        revalidatePath('/');
        revalidatePath('/products');
        revalidatePath(`/products/${product.slug}`);
        revalidatePath('/admin/products');
      } catch (e) {}

      const res = NextResponse.json({ success: true, product: updated });
      res.cookies.set('gutvaidya_custom_products', encodeURIComponent(JSON.stringify(overrides)), {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
      return res;
    } else if (action === 'create' && product) {
      const all = getLocalStoredProducts();
      const newProd = {
        ...product,
        id: product.id || `p-${Date.now()}`,
      };
      all.push(newProd);
      saveLocalStoredProducts(all);

      overrides[newProd.id] = {
        price: Number(newProd.price),
        compare_at_price: newProd.compare_at_price ? Number(newProd.compare_at_price) : undefined,
        stock_quantity: Number(newProd.stock_quantity),
        status: newProd.status,
        featured: newProd.featured,
      };
      if (newProd.slug) {
        overrides[newProd.slug] = overrides[newProd.id];
      }

      try {
        revalidatePath('/');
        revalidatePath('/products');
      } catch (e) {}

      const res = NextResponse.json({ success: true, product: newProd });
      res.cookies.set('gutvaidya_custom_products', encodeURIComponent(JSON.stringify(overrides)), {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
      return res;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin product error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
