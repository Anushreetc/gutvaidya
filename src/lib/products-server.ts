import fs from 'fs';
import path from 'path';
import { Product } from '@/types/ecommerce';
import { SEED_PRODUCTS } from './products';
import { createAdminClient } from './supabase/admin';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');
const TMP_DATA_FILE = '/tmp/products.json';

// In-memory cache across requests inside the same serverless execution container
let inMemoryProducts: Product[] | null = null;

export function getLocalStoredProducts(): Product[] {
  // 1. In-memory cache
  if (inMemoryProducts && inMemoryProducts.length > 0) {
    return inMemoryProducts;
  }

  // 2. Try reading from /tmp/products.json (Vercel Serverless writable disk)
  try {
    if (fs.existsSync(TMP_DATA_FILE)) {
      const raw = fs.readFileSync(TMP_DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryProducts = parsed;
        return parsed;
      }
    }
  } catch (err) {}

  // 3. Try reading from bundled data/products.json
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryProducts = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read data/products.json:', err);
  }

  inMemoryProducts = SEED_PRODUCTS;
  return SEED_PRODUCTS;
}

export function saveLocalStoredProducts(products: Product[]): boolean {
  inMemoryProducts = products;

  // 1. Try local data file (works in development or writable servers)
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    // Expected on Vercel read-only filesystem, safe to ignore
  }

  // 2. Try /tmp file (works on Vercel AWS Lambda /tmp)
  try {
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {}

  return true;
}

export async function getLiveProducts(): Promise<Product[]> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from('products')
        .select('*, categories(name, slug)')
        .order('name');

      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          ...p,
          price: Number(p.price),
          compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : undefined,
          category_name: p.categories?.name,
          images: p.images || [p.main_image],
          benefits: Array.isArray(p.benefits) ? p.benefits : [],
          rating: p.rating || 4.8,
          reviews_count: p.reviews_count || 45,
        }));
      }
    } catch (e) {
      // Fallback to local stored products
    }
  }

  return getLocalStoredProducts();
}

export async function updateLiveProduct(updatedProduct: Partial<Product> & { id: string }): Promise<Product> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      await adminClient
        .from('products')
        .update({
          price: updatedProduct.price,
          compare_at_price: updatedProduct.compare_at_price,
          stock_quantity: updatedProduct.stock_quantity,
          status: updatedProduct.status,
          featured: updatedProduct.featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedProduct.id);
    } catch (e) {
      console.warn('Supabase product update failed, updating local file:', e);
    }
  }

  // Always update local file
  const all = getLocalStoredProducts();
  const index = all.findIndex((p) => p.id === updatedProduct.id || p.slug === (updatedProduct as any).slug);

  let result: Product;
  if (index !== -1) {
    all[index] = { ...all[index], ...updatedProduct };
    result = all[index];
  } else {
    result = updatedProduct as Product;
    all.push(result);
  }

  saveLocalStoredProducts(all);
  return result;
}
