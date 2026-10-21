import { Product, Category } from '@/types/ecommerce';
import { createAdminClient } from './supabase/admin';
import { withRatings } from './reviews';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Wellness Mixes',
    slug: 'wellness-mixes',
    description: 'Signature daily sprouted grain & prebiotic herbal formulations.',
    image: '/product.jpeg',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Nutritional Care',
    slug: 'nutritional-care',
    description: 'Targeted wholesome nutritional blends for energy and recovery.',
    image: '/product.jpeg',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Specialty Blends',
    slug: 'specialty-blends',
    description: 'Ayurvedic formulations for metabolic balance, sugar regulation, and detox.',
    image: '/product.jpeg',
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'GutVaidya Health Mix',
    slug: 'gutvaidya-health-mix',
    short_description: 'Contains handpicked traditional grains, millets, nuts, and natural herbs for daily immunity, gut health, and steady energy levels.',
    description: 'GutVaidya Health Mix is crafted with over 36 sprouted grains, ancient millets, organic nuts, and sacred Ayurvedic herbs. Prepared following centuries-old tradition, this nutrient-dense mix is easy to digest, supports gut microbiome balance, soothes acidity, and provides sustained natural energy for the entire family without any artificial sweeteners or chemical preservatives.',
    price: 799,
    compare_at_price: 999,
    sku: 'GV-HM-500',
    stock_quantity: 120,
    category_id: 'c1111111-1111-1111-1111-111111111111',
    category_name: 'Wellness Mixes',
    main_image: '/product.jpeg',
    images: ['/product.jpeg', '/gutvaidya_banner1.png', '/gutvaidya_banner2.png'],
    status: 'active',
    featured: true,
    benefits: [
      '36+ Sprouted Natural Ingredients',
      'Zero Added Sugar & No Preservatives',
      'Rich in Prebiotic Fiber',
      'Deep Gut & Immunity Support',
      'Gentle on Sensitive Stomachs',
    ],
    ingredients: 'Sprouted Ragi, Foxtail Millet, Little Millet, Kodo Millet, Barnyard Millet, Sprouted Green Gram, Almonds, Walnuts, Pistachios, Cardamom, Dry Ginger, Shatavari, Licorice, Ashwagandha.',
    usage_instructions: 'Take 2 tablespoons (approx. 30g) of GutVaidya Health Mix. Mix with 250ml water or milk until smooth. Cook on medium flame for 3 to 5 minutes while stirring continuously. Add jaggery or honey to taste if desired. Enjoy warm as a wholesome breakfast.',
    weight_size: '500g',
    badge: 'Bestseller',
  },
];

// Helper to load persistent local products on the server
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const file = path.join(process.cwd(), 'data', 'products.json');
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {
      // Safe fallback
    }
  }
  return SEED_PRODUCTS;
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'rating';
  inStockOnly?: boolean;
}): Promise<Product[]> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      let query = adminClient
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('status', 'active');

      if (options?.featuredOnly) {
        query = query.eq('featured', true);
      }

      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options?.inStockOnly) {
        query = query.gt('stock_quantity', 0);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        let mapped = data.map((p: any) => ({
          ...p,
          price: Number(p.price),
          compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : undefined,
          category_name: p.categories?.name,
          images: p.images || [p.main_image],
          benefits: Array.isArray(p.benefits) ? p.benefits : [],
        }));

        if (options?.search) {
          const q = options.search.toLowerCase();
          mapped = mapped.filter(
            (p: Product) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.ingredients.toLowerCase().includes(q)
          );
        }

        mapped = await withRatings(mapped);

        if (options?.sortBy) {
          if (options.sortBy === 'price-asc') mapped.sort((a: Product, b: Product) => a.price - b.price);
          if (options.sortBy === 'price-desc') mapped.sort((a: Product, b: Product) => b.price - a.price);
          if (options.sortBy === 'rating') mapped.sort((a: Product, b: Product) => (b.rating || 0) - (a.rating || 0));
        }

        return mapped;
      }
    } catch (e) {
      console.warn('Supabase products fetch failed, using fallback seeds', e);
    }
  }

  // Fallback to persistent stored data or seed data
  let result = [...getStoredProducts()];

  if (options?.featuredOnly) {
    result = result.filter((p) => p.featured);
  }

  if (options?.categorySlug) {
    const cat = SEED_CATEGORIES.find((c) => c.slug === options.categorySlug);
    if (cat) {
      result = result.filter((p) => p.category_id === cat.id);
    }
  }

  if (options?.categoryId) {
    result = result.filter((p) => p.category_id === options.categoryId);
  }

  if (options?.inStockOnly) {
    result = result.filter((p) => p.stock_quantity > 0);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.toLowerCase().includes(q)
    );
  }

  if (options?.sortBy) {
    if (options.sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (options.sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (options.sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const [withRating] = await withRatings([{
          ...data,
          price: Number(data.price),
          compare_at_price: data.compare_at_price ? Number(data.compare_at_price) : undefined,
          category_name: data.categories?.name,
          images: data.images || [data.main_image],
          benefits: Array.isArray(data.benefits) ? data.benefits : [],
        }]);
        return withRating;
      }
    } catch (e) {
      console.warn('Supabase product slug lookup failed, using fallback seeds', e);
    }
  }

  const stored = getStoredProducts();
  return stored.find((p) => p.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  const adminClient = createAdminClient();

  if (adminClient) {
    try {
      const { data, error } = await adminClient.from('categories').select('*');
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase categories fetch failed, using fallback seeds', e);
    }
  }

  return SEED_CATEGORIES;
}

export async function getRelatedProducts(currentSlug: string, categoryId?: string): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.slug !== currentSlug).slice(0, 3);
}
