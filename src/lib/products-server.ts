import fs from 'fs';
import path from 'path';
import { Product } from '@/types/ecommerce';
import { SEED_PRODUCTS } from './products';
import { createAdminClient } from './supabase/admin';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

export function getLocalStoredProducts(): Product[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } else {
      // Initialize with SEED_PRODUCTS
      saveLocalStoredProducts(SEED_PRODUCTS);
    }
  } catch (err) {
    console.warn('Failed to read data/products.json:', err);
  }
  return SEED_PRODUCTS;
}

export function saveLocalStoredProducts(products: Product[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write data/products.json:', err);
    return false;
  }
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
