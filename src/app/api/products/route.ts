import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLiveProducts, updateLiveProduct } from '@/lib/products-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const products = await getLiveProducts();
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
