import fs from 'fs';
import path from 'path';
import { Product } from '@/types/ecommerce';
import { SEED_PRODUCTS } from './products';
import { createAdminClient } from './supabase/admin';
import { withRatings } from './reviews';

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
        return withRatings(data.map(mapDbProduct));
      }
    } catch (e) {
      // Fallback to local stored products
    }
  }

  return getLocalStoredProducts();
}

function mapDbProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.price),
    compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : undefined,
    category_name: p.categories?.name,
    images: p.images || [p.main_image],
    benefits: Array.isArray(p.benefits) ? p.benefits : [],
  };
}

export async function updateLiveProduct(updatedProduct: Partial<Product> & { id: string }): Promise<Product> {
  const adminClient = createAdminClient();

  if (adminClient) {
    const { data, error } = await adminClient
      .from('products')
      .update({
        price: updatedProduct.price,
        compare_at_price: updatedProduct.compare_at_price || null,
        stock_quantity: updatedProduct.stock_quantity,
        status: updatedProduct.status,
        featured: updatedProduct.featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', updatedProduct.id)
      .select('*, categories(name, slug)')
      .single();

    if (error) throw new Error(`Could not save product: ${error.message}`);
    return mapDbProduct(data);
  }

  // Demo mode: persist to the local file
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

export async function createLiveProduct(product: Product): Promise<Product> {
  const adminClient = createAdminClient();

  if (adminClient) {
    // Only send real table columns; the database generates the id
    const { data, error } = await adminClient
      .from('products')
      .insert({
        name: product.name,
        slug: product.slug,
        short_description: product.short_description,
        description: product.description,
        price: product.price,
        compare_at_price: product.compare_at_price || null,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id || null,
        main_image: product.main_image || '/product.jpeg',
        status: product.status || 'active',
        featured: product.featured ?? false,
        benefits: product.benefits || [],
        ingredients: product.ingredients,
        usage_instructions: product.usage_instructions,
        weight_size: product.weight_size,
        badge: product.badge || null,
      })
      .select('*, categories(name, slug)')
      .single();

    if (error) throw new Error(`Could not create product: ${error.message}`);
    return mapDbProduct(data);
  }

  const all = getLocalStoredProducts();
  const created = { ...product, id: product.id || `p-${Date.now()}` };
  all.push(created);
  saveLocalStoredProducts(all);
  return created;
}
