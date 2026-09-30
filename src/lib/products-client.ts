import { Product } from '@/types/ecommerce';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const STORAGE_KEY = 'gutvaidya_custom_products';
const COOKIE_NAME = 'gutvaidya_custom_products';
const CHANNEL_NAME = 'gutvaidya_products_sync';

export interface ProductOverride {
  price?: number;
  compare_at_price?: number;
  stock_quantity?: number;
  status?: 'active' | 'draft' | 'archived';
  featured?: boolean;
}

export type ProductOverridesMap = Record<string, ProductOverride>;

export function safeDecodeCookie(val: string): ProductOverridesMap {
  if (!val) return {};
  try {
    let decoded = val;
    if (decoded.includes('%')) {
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {}
    }
    if (decoded.includes('%')) {
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {}
    }
    const parsed = JSON.parse(decoded);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    try {
      return JSON.parse(val);
    } catch (err) {
      return {};
    }
  }
}

// Get overrides from localStorage and document.cookie
// With Supabase connected the database is the source of truth, so local overrides
// (a demo-mode mechanism) are ignored.
export function getProductOverrides(): ProductOverridesMap {
  if (typeof window === 'undefined' || isSupabaseConfigured()) return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (e) {}

  // Fallback to cookie
  try {
    const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
    if (match && match[2]) {
      return safeDecodeCookie(match[2]);
    }
  } catch (e) {}

  return {};
}

// Apply overrides to a single product
export function applyProductOverride(product: Product, overrides?: ProductOverridesMap): Product {
  const map = overrides || getProductOverrides();
  const override = map[product.id] || map[product.slug];
  if (!override) return product;

  return {
    ...product,
    ...(override.price !== undefined ? { price: Number(override.price) } : {}),
    ...(override.compare_at_price !== undefined ? { compare_at_price: Number(override.compare_at_price) } : {}),
    ...(override.stock_quantity !== undefined ? { stock_quantity: Number(override.stock_quantity) } : {}),
    ...(override.status !== undefined ? { status: override.status } : {}),
    ...(override.featured !== undefined ? { featured: override.featured } : {}),
  };
}

// Apply overrides to an array of products
export function applyProductOverrides(products: Product[], overrides?: ProductOverridesMap): Product[] {
  const map = overrides || getProductOverrides();
  if (Object.keys(map).length === 0) return products;
  return products.map((p) => applyProductOverride(p, map));
}

// Save an updated product to localStorage, cookie, and broadcast to all tabs
export function saveProductUpdate(product: Product): ProductOverridesMap {
  if (typeof window === 'undefined') return {};

  const currentOverrides = getProductOverrides();
  const override: ProductOverride = {
    price: Number(product.price),
    compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
    stock_quantity: Number(product.stock_quantity),
    status: product.status,
    featured: product.featured,
  };

  currentOverrides[product.id] = override;
  currentOverrides[product.slug] = override;

  if (!isSupabaseConfigured()) try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentOverrides));
  } catch (e) {}

  if (!isSupabaseConfigured()) try {
    // Set cookie valid for 1 year across all paths
    const cookieVal = encodeURIComponent(JSON.stringify(currentOverrides));
    document.cookie = `${COOKIE_NAME}=${cookieVal}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) {}

  // Broadcast to other tabs
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      bc.postMessage({ type: 'PRODUCTS_UPDATED', overrides: currentOverrides });
      bc.close();
    }
  } catch (e) {}

  // Dispatch event for current tab
  try {
    window.dispatchEvent(new CustomEvent('gutvaidya_products_updated', { detail: currentOverrides }));
  } catch (e) {}

  return currentOverrides;
}

// Subscribe to product updates across tabs and current window
export function subscribeToProductUpdates(callback: (overrides: ProductOverridesMap) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let bc: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event.data?.type === 'PRODUCTS_UPDATED') {
          callback(event.data.overrides || getProductOverrides());
        }
      };
    }
  } catch (e) {}

  const handleCustomEvent = (event: any) => {
    callback(event.detail || getProductOverrides());
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback(getProductOverrides());
    }
  };

  window.addEventListener('gutvaidya_products_updated', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  // Supabase Realtime: every visitor sees admin price/stock edits without reloading
  const supabase = createClient();
  const channel = supabase
    ?.channel(`products-live-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
      const row = payload.new as any;
      const override: ProductOverride = {
        price: Number(row.price),
        compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : undefined,
        stock_quantity: Number(row.stock_quantity),
        status: row.status,
        featured: row.featured,
      };
      callback({ [row.id]: override, [row.slug]: override });
    })
    .subscribe();

  return () => {
    if (bc) bc.close();
    if (supabase && channel) supabase.removeChannel(channel);
    window.removeEventListener('gutvaidya_products_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
