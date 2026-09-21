import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateLiveProduct, saveLocalStoredProducts, getLocalStoredProducts } from '@/lib/products-server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, product } = body;

    if (action === 'update' && product) {
      const updated = await updateLiveProduct(product);

      try {
        revalidatePath('/');
        revalidatePath('/products');
        revalidatePath(`/products/${product.slug}`);
        revalidatePath('/admin/products');
      } catch (e) {}

      return NextResponse.json({ success: true, product: updated });
    } else if (action === 'create' && product) {
      const all = getLocalStoredProducts();
      const newProd = {
        ...product,
        id: product.id || `p-${Date.now()}`,
      };
      all.push(newProd);
      saveLocalStoredProducts(all);

      try {
        revalidatePath('/');
        revalidatePath('/products');
      } catch (e) {}

      return NextResponse.json({ success: true, product: newProd });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin product error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
