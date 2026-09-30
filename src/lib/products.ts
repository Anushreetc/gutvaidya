import { Product, Category } from '@/types/ecommerce';
import { createAdminClient } from './supabase/admin';

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
    rating: 4.9,
    reviews_count: 128,
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'GutVaidya Baal Vit',
    slug: 'gutvaidya-baal-vit',
    short_description: 'Delicious, nutrient-dense wellness energy formulation specially balanced for growing children and youth.',
    description: 'GutVaidya Baal Vit is formulated to support childhood growth, sharp cognitive development, bone strength, and strong natural immunity. Made with sprouted grains, organic dry fruits, and brain-supporting herbs like Brahmi and Shankhpushpi, it transforms daily milk into a powerhouse of natural bioavailable nutrition.',
    price: 899,
    compare_at_price: 1099,
    sku: 'GV-BV-500',
    stock_quantity: 85,
    category_id: 'c2222222-2222-2222-2222-222222222222',
    category_name: 'Nutritional Care',
    main_image: '/product.jpeg',
    images: ['/product.jpeg', '/gutvaidya_banner2.png'],
    status: 'active',
    featured: true,
    benefits: [
      'Rich in Natural Bioavailable Calcium & Iron',
      'Supports Cognitive Focus & Memory',
      'Strengthens Bones & Immunity',
      '100% Kid-Approved Natural Taste',
    ],
    ingredients: 'Sprouted Ragi, Whole Green Gram, Almonds, Cashews, Brahmi, Shankhpushpi, Saffron, Green Cardamom, Sprouted Barley.',
    usage_instructions: 'Mix 1-2 spoons in a glass of warm milk. Whisk thoroughly and serve in the morning or after sports.',
    weight_size: '500g',
    badge: 'Kids Favorite',
    rating: 4.8,
    reviews_count: 86,
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    name: 'GutVaidya Sampoora',
    slug: 'gutvaidya-sampoora',
    short_description: 'Complete senior wellness and vitality nutrition for holistic daily strength and digestive ease.',
    description: 'Formulated specifically for senior adults and individuals recovering from illness. Sampoora offers complete easily absorbable plant nutrition with joint-nourishing minerals, restorative Ayurvedic roots, and calming digestive seeds.',
    price: 899,
    compare_at_price: 1099,
    sku: 'GV-SP-500',
    stock_quantity: 60,
    category_id: 'c1111111-1111-1111-1111-111111111111',
    category_name: 'Wellness Mixes',
    main_image: '/product.jpeg',
    images: ['/product.jpeg'],
    status: 'active',
    featured: false,
    benefits: [
      'Ease on Digestion & Nutrient Absorption',
      'Supports Joint Flexibility',
      'Restores Daily Vitality & Stamina',
      'Natural Anti-inflammatory Compounds',
    ],
    ingredients: 'Sprouted Foxtail Millet, Sesame Seeds, Flax Seeds, Turmeric (Curcumin 3%), Dry Ginger, Ashwagandha, Methi (Fenugreek), Ajwain.',
    usage_instructions: 'Stir 2 spoons into warm water, buttermilk, or soup broth. Consume once daily after lunch or dinner.',
    weight_size: '500g',
    badge: 'Popular',
    rating: 4.9,
    reviews_count: 54,
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    name: 'GutVaidya Yuva Ojiva',
    slug: 'gutvaidya-yuva-ojiva',
    short_description: 'High-vitality active lifestyle protein and adaptogen blend for working professionals and athletes.',
    description: 'Packed with natural plant proteins, sprouted pulses, and revitalizing herbs, Yuva Ojiva fuels active days without stomach heaviness, bloating, or synthetic isolates. It promotes clean muscle recovery and balances stress cortisol.',
    price: 899,
    compare_at_price: 1149,
    sku: 'GV-YO-500',
    stock_quantity: 75,
    category_id: 'c2222222-2222-2222-2222-222222222222',
    category_name: 'Nutritional Care',
    main_image: '/product.jpeg',
    images: ['/product.jpeg'],
    status: 'active',
    featured: true,
    benefits: [
      '100% Plant-Powered Protein',
      'Adaptogenic Stress Relief',
      'No Bloating or Heavy Fillers',
      'Clean Sustained Stamina',
    ],
    ingredients: 'Sprouted Moong, Roasted Bengal Gram, Chia Seeds, Pumpkin Seeds, Moringa Leaf, Safed Musli, Gokshura, Raw Cacao.',
    usage_instructions: 'Blend 2 scoops into your morning smoothie, almond milk, or warm water. Ideal post-workout or as a high-protein breakfast.',
    weight_size: '500g',
    badge: 'Trending',
    rating: 4.7,
    reviews_count: 67,
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    name: 'GutVaidya Proliva',
    slug: 'gutvaidya-proliva',
    short_description: 'Liver detox and natural bile support blend promoting cellular gut-liver axis cleansing.',
    description: 'The gut and liver work hand in hand. Proliva brings together classic hepatic herbs that stimulate gentle detoxification, enhance digestive fire (Agni), and protect liver tissue against oxidative stress.',
    price: 899,
    compare_at_price: 1099,
    sku: 'GV-PL-500',
    stock_quantity: 50,
    category_id: 'c3333333-3333-3333-3333-333333333333',
    category_name: 'Specialty Blends',
    main_image: '/product.jpeg',
    images: ['/product.jpeg'],
    status: 'active',
    featured: false,
    benefits: [
      'Deep Liver Detox & Regeneration',
      'Promotes Healthy Bile Flow',
      'Relieves Chronic Sluggish Digestion',
      'Rich in Natural Antioxidants',
    ],
    ingredients: 'Bhumyamalaki, Kalmegh, Milk Thistle Seed, Punarnava, Kutki, Sprouted Horsegram, Cumin, Fennel.',
    usage_instructions: 'Take 1 teaspoon in lukewarm water first thing in the morning on an empty stomach.',
    weight_size: '500g',
    badge: 'New Release',
    rating: 4.8,
    reviews_count: 42,
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    name: 'GutVaidya Gluco Care',
    slug: 'gutvaidya-gluco-care',
    short_description: 'Low-glycemic metabolic formula with bitter melon, jamun seeds, and soluble prebiotic fibers.',
    description: 'Specifically tailored for individuals looking to maintain healthy blood glucose levels and insulin sensitivity naturally. Formulated with low-GI millets and potent glycemic-balancing herbs.',
    price: 899,
    compare_at_price: 1199,
    sku: 'GV-GC-500',
    stock_quantity: 90,
    category_id: 'c3333333-3333-3333-3333-333333333333',
    category_name: 'Specialty Blends',
    main_image: '/product.jpeg',
    images: ['/product.jpeg'],
    status: 'active',
    featured: true,
    benefits: [
      'Supports Balanced Blood Sugar Levels',
      'Curbs Unhealthy Sugar Cravings',
      'Ultra Low Glycemic Index (<35)',
      'High Soluble Fiber Matrix',
    ],
    ingredients: 'Sprouted Barnyard Millet, Jamun Seed Powder, Karela (Bitter Gourd), Fenugreek Seeds, Vijaysar Bark, Gurmar (Gymnema Sylvestre), Cinnamon.',
    usage_instructions: 'Take 2 spoons stirred into warm water 15 minutes before breakfast and dinner.',
    weight_size: '500g',
    badge: 'Recommended',
    rating: 4.9,
    reviews_count: 73,
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777',
    name: 'GutVaidya Fat Trim',
    slug: 'gutvaidya-fat-trim',
    short_description: 'Thermogentic Ayurvedic metabolism booster designed to assist healthy weight management and gut transit.',
    description: 'Fat Trim combines gentle thermogenic spices with detoxifying Triphala and sprouted grains to enhance resting metabolism, flush excess water weight, and maintain regular healthy bowel movements.',
    price: 899,
    compare_at_price: 1199,
    sku: 'GV-FT-500',
    stock_quantity: 65,
    category_id: 'c3333333-3333-3333-3333-333333333333',
    category_name: 'Specialty Blends',
    main_image: '/product.jpeg',
    images: ['/product.jpeg'],
    status: 'active',
    featured: false,
    benefits: [
      'Stimulates Healthy Metabolic Rate',
      'Aids Natural Fat Metabolism',
      'Triphala-Enhanced Colon Cleanse',
      'Reduces Water Retention & Bloat',
    ],
    ingredients: 'Sprouted Horsegram, Triphala (Amalaki, Bibhitaki, Haritaki), Guggulu, Black Pepper, Long Pepper (Pippali), Ginger, Garcinia Cambogia, Green Tea Extract.',
    usage_instructions: 'Mix 1 tablespoon in warm water with a squeeze of fresh lemon juice, twice daily before meals.',
    weight_size: '500g',
    badge: 'New Release',
    rating: 4.8,
    reviews_count: 39,
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
          rating: p.rating || 4.8,
          reviews_count: p.reviews_count || 45,
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
        return {
          ...data,
          price: Number(data.price),
          compare_at_price: data.compare_at_price ? Number(data.compare_at_price) : undefined,
          category_name: data.categories?.name,
          images: data.images || [data.main_image],
          benefits: Array.isArray(data.benefits) ? data.benefits : [],
          rating: data.rating || 4.9,
          reviews_count: data.reviews_count || 50,
        };
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
