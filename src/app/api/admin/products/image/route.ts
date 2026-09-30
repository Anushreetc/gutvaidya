import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminApi } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';

const BUCKET = 'product-images';
// Vercel caps request bodies at 4.5 MB, so stay safely under it
const MAX_BYTES = 4 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

// Uploads a new main photo for a product to Supabase Storage and points the product at it.
export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const adminClient = createAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Photo upload needs the Supabase database to be connected.' }, { status: 400 });
  }

  try {
    const form = await req.formData();
    const productId = String(form.get('productId') || '');
    const file = form.get('file');

    if (!/^[0-9a-f-]{36}$/i.test(productId)) {
      return NextResponse.json({ error: 'Invalid product.' }, { status: 400 });
    }
    if (!(file instanceof File) || !EXTENSIONS[file.type]) {
      return NextResponse.json({ error: 'Please choose a JPG, PNG or WebP image.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be 4 MB or smaller.' }, { status: 400 });
    }

    const { data: product, error: findErr } = await adminClient
      .from('products')
      .select('slug, main_image')
      .eq('id', productId)
      .single();
    if (findErr || !product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const path = `${productId}/${Date.now()}.${EXTENSIONS[file.type]}`;
    const { error: uploadErr } = await adminClient.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, cacheControl: '31536000' });
    if (uploadErr) throw uploadErr;

    const { data: publicUrl } = adminClient.storage.from(BUCKET).getPublicUrl(path);

    const { error: updateErr } = await adminClient
      .from('products')
      .update({ main_image: publicUrl.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', productId);
    if (updateErr) {
      await adminClient.storage.from(BUCKET).remove([path]);
      throw updateErr;
    }

    // Tidy up the previous photo if it was one we uploaded
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    if (product.main_image?.includes(marker)) {
      await adminClient.storage.from(BUCKET).remove([product.main_image.split(marker)[1]]);
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath(`/products/${product.slug}`);
    } catch (e) {}

    return NextResponse.json({ success: true, main_image: publicUrl.publicUrl });
  } catch (err: any) {
    console.error('Product image upload error', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
