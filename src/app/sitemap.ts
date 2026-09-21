import { MetadataRoute } from 'next';
import { SEED_PRODUCTS } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gutvaidya.in';

  // Static routes
  const staticRoutes = [
    '',
    '/products',
    '/cart',
    '/checkout',
    '/auth/login',
    '/auth/register',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = SEED_PRODUCTS.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
