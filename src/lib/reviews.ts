import { Product } from '@/types/ecommerce';
import { createAdminClient } from './supabase/admin';

export interface PublicReview {
  id: string;
  customer_name: string;
  rating: number;
  review: string;
  verified_purchase: boolean;
  created_at: string;
}

// Approved reviews for one product, newest first
export async function getApprovedReviews(productId: string): Promise<PublicReview[]> {
  const adminClient = createAdminClient();
  if (!adminClient) return [];

  const { data, error } = await adminClient
    .from('reviews')
    .select('id, customer_name, rating, review, verified_purchase, created_at')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Reviews fetch failed', error.message);
    return [];
  }
  return data as PublicReview[];
}

// Adds rating and reviews_count from approved reviews. Products without reviews get
// neither, so the storefront shows no stars instead of an invented rating.
export async function withRatings<T extends Product>(products: T[]): Promise<T[]> {
  const adminClient = createAdminClient();
  if (!adminClient || products.length === 0) return products.map(stripRating);

  const { data, error } = await adminClient
    .from('reviews')
    .select('product_id, rating')
    .eq('approved', true)
    .in('product_id', products.map((p) => p.id));
  if (error) {
    console.error('Rating summary failed', error.message);
    return products.map(stripRating);
  }

  const totals = new Map<string, { sum: number; count: number }>();
  for (const r of data || []) {
    const t = totals.get(r.product_id) || { sum: 0, count: 0 };
    t.sum += r.rating;
    t.count += 1;
    totals.set(r.product_id, t);
  }

  return products.map((p) => {
    const t = totals.get(p.id);
    if (!t) return stripRating(p);
    return { ...p, rating: Math.round((t.sum / t.count) * 10) / 10, reviews_count: t.count };
  });
}

function stripRating<T extends Product>(p: T): T {
  const { rating: _rating, reviews_count: _count, ...rest } = p;
  return rest as T;
}
